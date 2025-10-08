<script>
  import { createEventDispatcher } from 'svelte';
  import axios from 'axios';

  export let accept = "image/*,video/*";
  export let folder = "carousel";
  export let maxSize = 50 * 1024 * 1024; // 50MB default untuk video
  export let maxFiles = 10; // Maksimal 10 file untuk carousel
  export let placeholder = "Pilih file untuk carousel (gambar/video)";
  export let disabled = false;
  export let currentFiles = []; // Array of existing files

  const dispatch = createEventDispatcher();

  let uploading = false;
  let uploadProgress = {};
  let error = "";
  let dragOver = false;
  let fileInput;
  let selectedFiles = [...currentFiles];

  // Handle file selection
  async function handleFileSelect(event) {
    const files = Array.from(event.target.files || event.dataTransfer?.files || []);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }

  // Handle drag and drop
  function handleDragOver(event) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragOver = false;
  }

  async function handleDrop(event) {
    event.preventDefault();
    dragOver = false;
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }

  // Upload multiple files to S3
  async function uploadFiles(files) {
    try {
      error = "";
      
      // Check total files limit
      if (selectedFiles.length + files.length > maxFiles) {
        throw new Error(`Maksimal ${maxFiles} file untuk carousel`);
      }

      uploading = true;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${Date.now()}_${i}`;
        
        // Validate file size
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} terlalu besar. Maksimal ${Math.round(maxSize / 1024 / 1024)}MB`);
        }

        // Validate file type
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          throw new Error(`File ${file.name} harus berupa gambar atau video`);
        }

        uploadProgress[fileId] = 0;

        // Get signed URL from backend
        const signedUrlResponse = await axios.post('/api/s3/signed-url', {
          filename: file.name,
          contentType: file.type,
          folder: folder
        });

        if (!signedUrlResponse.data.success) {
          throw new Error(signedUrlResponse.data.message || 'Gagal mendapatkan signed URL');
        }

        const { signedUrl, publicUrl, fileKey } = signedUrlResponse.data.data;

        // Upload file to S3 using signed URL
        await axios.put(signedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            uploadProgress[fileId] = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          }
        });

        // Add to selected files
        const fileInfo = {
          id: fileId,
          publicUrl,
          fileKey,
          filename: file.name,
          size: file.size,
          type: file.type,
          isImage: file.type.startsWith('image/'),
          isVideo: file.type.startsWith('video/')
        };

        selectedFiles = [...selectedFiles, fileInfo];
        delete uploadProgress[fileId];
      }

      // Dispatch success event with all files
      dispatch('upload', {
        files: selectedFiles
      });

      uploading = false;

    } catch (err) {
      console.error('Upload error:', err);
      error = err.response?.data?.message || err.message || 'Gagal mengupload file';
      uploading = false;
      uploadProgress = {};
    }
  }

  // Trigger file input click
  function triggerFileInput() {
    if (!disabled && !uploading) {
      fileInput.click();
    }
  }

  // Remove specific file
  function removeFile(fileId) {
    selectedFiles = selectedFiles.filter(f => f.id !== fileId);
    dispatch('upload', {
      files: selectedFiles
    });
  }

  // Remove all files
  function removeAllFiles() {
    selectedFiles = [];
    dispatch('upload', {
      files: selectedFiles
    });
  }

  // Get file preview
  function getFilePreview(file) {
    if (file.isImage) {
      return file.publicUrl;
    }
    return null; // For video, we'll show a video icon
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
</script>

<div class="w-full space-y-4">
  <!-- File Input (Hidden) -->
  <input
    bind:this={fileInput}
    type="file"
    multiple
    {accept}
    on:change={handleFileSelect}
    class="hidden"
    {disabled}
  />

  <!-- Upload Area -->
  <div
    class="relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 {dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300'} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}"
    on:click={triggerFileInput}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
  >
    {#if uploading}
      <!-- Upload Progress -->
      <div class="space-y-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p class="text-sm text-gray-600">Mengupload file...</p>
        {#each Object.entries(uploadProgress) as [fileId, progress]}
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-emerald-600 h-2 rounded-full transition-all duration-300" style="width: {progress}%"></div>
          </div>
          <p class="text-xs text-gray-500">{progress}%</p>
        {/each}
      </div>
    {:else}
      <!-- Upload Instructions -->
      <div class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="text-sm text-gray-600">{placeholder}</p>
        <p class="text-xs text-gray-500">
          Drag & drop atau klik untuk memilih file<br>
          Maksimal {maxFiles} file, {Math.round(maxSize / 1024 / 1024)}MB per file
        </p>
      </div>
    {/if}
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
      {error}
    </div>
  {/if}

  <!-- Selected Files Preview -->
  {#if selectedFiles.length > 0}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-medium text-gray-900">File Terpilih ({selectedFiles.length}/{maxFiles})</h4>
        <button
          type="button"
          on:click={removeAllFiles}
          class="text-xs text-red-600 hover:text-red-800"
        >
          Hapus Semua
        </button>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {#each selectedFiles as file (file.id)}
          <div class="relative group border border-gray-200 rounded-lg p-2 bg-white">
            <!-- File Preview -->
            <div class="aspect-square mb-2 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              {#if file.isImage}
                <img src={file.publicUrl} alt={file.filename} class="w-full h-full object-cover" />
              {:else if file.isVideo}
                <div class="text-center">
                  <svg class="w-8 h-8 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  <p class="text-xs text-gray-500">Video</p>
                </div>
              {/if}
            </div>
            
            <!-- File Info -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-gray-900 truncate" title={file.filename}>
                {file.filename}
              </p>
              <p class="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            
            <!-- Remove Button -->
            <button
                aria-label="Hapus file dari daftar"
                type="button"
                on:click={() => removeFile(file.id)}
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>