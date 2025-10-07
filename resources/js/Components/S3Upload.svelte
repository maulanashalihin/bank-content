<script>
  import { createEventDispatcher } from 'svelte';
  import axios from 'axios';

  export let accept = "image/*";
  export let folder = "uploads";
  export let maxSize = 10 * 1024 * 1024; // 10MB default
  export let placeholder = "Pilih file untuk diupload";
  export let disabled = false;
  export let currentFile = null; // Current file object

  const dispatch = createEventDispatcher();

  let uploading = false;
  let uploadProgress = 0;
  let error = "";
  let dragOver = false;
  let fileInput;
  let selectedFile = currentFile;
  let preview = null;

  // Create preview for current file
  $: if (selectedFile && selectedFile.publicUrl) {
    if (selectedFile.isImage) {
      preview = selectedFile.publicUrl;
    } else {
      preview = null;
    }
  }

  // Handle file selection
  async function handleFileSelect(event) {
    const files = Array.from(event.target.files || event.dataTransfer?.files || []);
    if (files.length > 0) {
      await uploadFile(files[0]);
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
      await uploadFile(files[0]);
    }
  }

  // Upload single file to S3
  async function uploadFile(file) {
    try {
      error = "";
      
      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File terlalu besar. Maksimal ${Math.round(maxSize / 1024 / 1024)}MB`);
      }

      uploading = true;
      uploadProgress = 0;

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
          uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      });

      // Create file info object
      const fileInfo = {
        publicUrl,
        fileKey,
        filename: file.name,
        size: file.size,
        type: file.type,
        isImage: file.type.startsWith('image/'),
        isVideo: file.type.startsWith('video/')
      };

      selectedFile = fileInfo;
      uploading = false;
      uploadProgress = 0;

      // Dispatch success event
      dispatch('upload', {
        file: fileInfo
      });

    } catch (err) {
      console.error('Upload error:', err);
      error = err.response?.data?.message || err.message || 'Gagal mengupload file';
      uploading = false;
      uploadProgress = 0;
    }
  }

  // Trigger file input click
  function triggerFileInput() {
    if (!disabled && !uploading) {
      fileInput.click();
    }
  }

  // Remove file
  function removeFile() {
    selectedFile = null;
    preview = null;
    dispatch('upload', {
      file: null
    });
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
        <p class="text-sm text-gray-600">Mengupload... {uploadProgress}%</p>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-emerald-600 h-2 rounded-full transition-all duration-300" style="width: {uploadProgress}%"></div>
        </div>
      </div>
    {:else if selectedFile}
      <!-- File Preview -->
      <div class="space-y-3">
        {#if preview}
          <img src={preview} alt={selectedFile.filename} class="max-h-32 mx-auto rounded-lg shadow-md" />
        {:else}
          <div class="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-lg">
            {#if selectedFile.isVideo}
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            {:else}
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            {/if}
          </div>
        {/if}
        <div class="text-sm">
          <p class="font-medium text-gray-900">{selectedFile.filename}</p>
          <p class="text-gray-500">{formatFileSize(selectedFile.size)}</p>
        </div>
        <button
          type="button"
          on:click|stopPropagation={removeFile}
          class="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Hapus
        </button>
      </div>
    {:else}
      <!-- Upload Prompt -->
      <div class="space-y-3">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div>
          <p class="text-sm text-gray-600">{placeholder}</p>
          <p class="text-xs text-gray-500 mt-1">Drag & drop atau klik untuk memilih file</p>
          <p class="text-xs text-gray-400 mt-1">Maksimal {Math.round(maxSize / 1024 / 1024)}MB</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{error}</p>
        </div>
      </div>
    </div>
  {/if}
</div>