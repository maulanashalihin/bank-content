<script>
  import { createEventDispatcher } from 'svelte';
  import axios from 'axios';

  export let accept = "image/*";
  export let folder = "uploads";
  export let maxSize = 5 * 1024 * 1024; // 5MB default
  export let currentUrl = "";
  export let placeholder = "Pilih file untuk diupload";
  export let disabled = false;

  const dispatch = createEventDispatcher();

  let uploading = false;
  let uploadProgress = 0;
  let error = "";
  let dragOver = false;
  let fileInput;

  // Handle file selection
  async function handleFileSelect(event) {
    const files = event.target.files || event.dataTransfer?.files;
    if (files && files.length > 0) {
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
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  }

  // Upload file to S3
  async function uploadFile(file) {
    try {
      error = "";
      uploading = true;
      uploadProgress = 0;

      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File terlalu besar. Maksimal ${Math.round(maxSize / 1024 / 1024)}MB`);
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Hanya file gambar yang diperbolehkan');
      }

      // Get signed URL from backend
      const signedUrlResponse = await axios.post('/api/s3/product-image-url', {
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

      // Dispatch success event with file info
      dispatch('upload', {
        publicUrl,
        fileKey,
        filename: file.name,
        size: file.size,
        type: file.type
      });

      uploading = false;
      uploadProgress = 0;

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

  // Remove current file
  function removeFile() {
    dispatch('remove');
  }
</script>

<div class="w-full">
  <!-- File Input (Hidden) -->
  <input
    bind:this={fileInput}
    type="file"
    id="image-upload"
    {accept}
    on:change={handleFileSelect}
    class="hidden"
    {disabled}
  />

  <!-- Upload Area -->
  <div
    class="relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 {dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}"
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
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-sm text-gray-600">Mengupload... {uploadProgress}%</p>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
            style="width: {uploadProgress}%"
          ></div>
        </div>
      </div>
    {:else if currentUrl}
      <!-- Current File Preview -->
      <div class="space-y-3">
        <img 
          src={currentUrl} 
          alt="Preview" 
          class="max-h-32 mx-auto rounded-lg shadow-sm"
        />
        <div class="flex items-center justify-center space-x-2">
          <button
            type="button"
            on:click|stopPropagation={triggerFileInput}
            class="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
          >
            Ganti File
          </button>
          <span class="text-gray-300">|</span>
          <button
            type="button"
            on:click|stopPropagation={removeFile}
            class="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Hapus
          </button>
        </div>
      </div>
    {:else}
      <!-- Upload Placeholder -->
      <div class="space-y-3">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div>
          <p class="text-sm text-gray-600">{placeholder}</p>
          <p class="text-xs text-gray-500 mt-1">
            Drag & drop atau klik untuk memilih file
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Maksimal {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
      {error}
    </div>
  {/if}
</div>