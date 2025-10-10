<script>
  import { router, inertia } from '@inertiajs/svelte';
  import axios from 'axios';
  import Header from '../../Components/Header.svelte';
  import CarouselUpload from '../../Components/CarouselUpload.svelte';
  import S3Upload from '../../Components/S3Upload.svelte';

  export let content = {};
  export let products = [];
  export let contentTypes = [];
  export let user;

  let form = {
    title: content.title || '',
    content_text: content.content_text || '',
    product_id: content.product_id || '',
    content_type_id: content.content_type_id || '',
    youtube_url: content.youtube_url || '',
    tags: content.tags || '',
    is_public: content.is_public !== undefined ? content.is_public : true,
    is_featured: content.is_featured !== undefined ? content.is_featured : false
  };

  let selectedFile = null;
  let selectedFiles = content.carousel_files || [];
  let uploadProgress = 0;
  let isUploading = false;
  let previewUrl = null;
  let removeExistingFile = false;

  // Handler for carousel uploads
  function handleCarouselUpload(event) {
    selectedFiles = event.detail.files;
  }

  // Handler for S3 uploads
  function handleS3Upload(event) {
    const uploadedFile = event.detail.file;
    selectedFile = uploadedFile;
    removeExistingFile = false;
  }

  // Initialize preview for existing file
  if (content.file_path && content.file_type?.startsWith('image/')) {
    previewUrl = content.file_path;
  }

  function restoreExistingFile() {
    selectedFile = null;
    removeExistingFile = false;
    if (content.file_path && content.file_type?.startsWith('image/')) {
      previewUrl = content.file_path;
    } else {
      previewUrl = null;
    }
  }

  function removeFile() {
    selectedFile = null;
    removeExistingFile = true;
    previewUrl = null;
  }

  function getContentTypeInfo(typeId) {
    const type = contentTypes.find(t => t.id === typeId);
    if (!type) return { icon: '📄', color: 'bg-gray-100 text-gray-800' };
    
    const icons = {
      'image': '🖼️',
      'video': '🎥',
      'blog_post': '📝',
      'email': '📧',
      'whatsapp_message': '💬',
      'short_video': '📱',
      'youtube_video': '🎬',
      'carousel': '🎠'
    };
    
    const colors = {
      'image': 'bg-purple-100 text-purple-800',
      'video': 'bg-red-100 text-red-800',
      'blog_post': 'bg-blue-100 text-blue-800',
      'email': 'bg-green-100 text-green-800',
      'whatsapp_message': 'bg-emerald-100 text-emerald-800',
      'short_video': 'bg-pink-100 text-pink-800',
      'youtube_video': 'bg-orange-100 text-orange-800',
      'carousel': 'bg-indigo-100 text-indigo-800'
    };
    
    return {
      icon: icons[typeId] || '📄',
      color: colors[typeId] || 'bg-gray-100 text-gray-800'
    };
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file icon based on file type
  function getFileIcon(file) {
    if (!file || !file.type) return '📄';
    
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.includes('pdf')) return '📕';
    if (file.type.includes('word') || file.type.includes('document')) return '📝';
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return '📊';
    if (file.type.includes('powerpoint') || file.type.includes('presentation')) return '📊';
    
    return '📄';
  }

  async function submitForm() {
    if (isUploading) return;
    
    isUploading = true;
    uploadProgress = 0;

    try {
      // Prepare data object for JSON submission
      const submitData = {
        ...form
      };

      // Add carousel files if carousel content type
      if (form.content_type_id === 'carousel') {
        submitData.carousel_files = selectedFiles.map(file => ({
          url: file.publicUrl || file.url,
          key: file.fileKey || file.key,
          filename: file.filename,
          size: file.size,
          type: file.type
        }));
      }

      // Add single file data if non-carousel content with file
      if (selectedFile && form.content_type_id !== 'carousel') {
        submitData.file_data = {
          url: selectedFile.publicUrl,
          key: selectedFile.fileKey,
          filename: selectedFile.filename,
          size: selectedFile.size,
          type: selectedFile.type
        };
      }

      // Add remove file flag for non-carousel
      if (removeExistingFile) {
        submitData.remove_file = true;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        uploadProgress += Math.random() * 30;
        if (uploadProgress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200);

      // Use axios for JSON submission
      const response = await axios.put(`/contents/${content.id}`, submitData);

      // Handle success
      uploadProgress = 100;
      setTimeout(() => {
        clearInterval(progressInterval);
        isUploading = false;
        // Navigate back to content detail page
        router.visit(`/contents/${content.id}`);
      }, 500);
    } catch (error) {
      console.error('Update failed:', error);
      clearInterval(progressInterval);
      isUploading = false;
      uploadProgress = 0;
      
      // Show error message to user
      if (error.response && error.response.data && error.response.data.message) {
        alert('Error: ' + error.response.data.message);
      } else {
        alert('Terjadi kesalahan saat memperbarui konten. Silakan coba lagi.');
      }
    }
  }
</script>

<Header group="contents" />

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        ✏️ Edit Konten
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        Perbarui konten Anda
      </p>
    </div>

    <form on:submit|preventDefault={submitForm} class="space-y-8">
      
      <!-- Content Type Selection -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          🎯 Jenis Konten
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each contentTypes as type}
            {@const typeInfo = getContentTypeInfo(type.id)}
            <label class="relative cursor-pointer">
              <input 
                type="radio" 
                bind:group={form.content_type_id} 
                value={type.id}
                class="sr-only peer"
              />
              <div class="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-center hover:border-purple-300 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 transition-all duration-200">
                <div class="text-3xl mb-2">{typeInfo.icon}</div>
                <div class="font-semibold text-gray-900 dark:text-white text-sm">
                  {type.display_name}
                </div>
                {#if type.description}
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {type.description}
                  </div>
                {/if}
              </div>
            </label>
          {/each}
        </div>
      </div>

      <!-- Basic Information -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          📝 Informasi Dasar
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Title -->
          <div class="md:col-span-2">
            <label for="edit-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ✏️ Judul Konten *
            </label>
            <input 
              id="edit-title"
              bind:value={form.title}
              type="text" 
              required
              placeholder="Berikan judul yang menarik untuk konten Anda..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Product -->
          <div>
            <label for="edit-product" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🏷️ Produk Terkait
            </label>
            <select 
              id="edit-product"
              bind:value={form.product_id}
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Pilih Produk (Opsional)</option>
              {#each products as product}
                <option value={product.id}>{product.name}</option>
              {/each}
            </select>
          </div>

          <!-- Tags -->
          <div>
            <label for="edit-tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🏷️ Tag
            </label>
            <input 
              id="edit-tags"
              bind:value={form.tags}
              type="text" 
              placeholder="marketing, email, promo (pisahkan dengan koma)"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Content Input -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          💭 Konten
        </h2>

        <!-- YouTube URL (if youtube_video type) -->
        {#if form.content_type_id === 'youtube_video'}
          <div class="mb-6">
            <label for="edit-youtube-url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎬 URL YouTube
            </label>
            <input 
              id="edit-youtube-url"
              bind:value={form.youtube_url}
              type="url" 
              placeholder="https://www.youtube.com/watch?v=..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        {/if}

        <!-- Text Content -->
        <div class="mb-6">
          <label for="edit-content-text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📄 Konten Teks
          </label>
          <textarea 
            id="edit-content-text"
            bind:value={form.content_text}
            rows="6"
            placeholder="Tulis konten Anda di sini... Bisa berupa deskripsi, copy email, caption, atau konten lainnya."
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          ></textarea>
        </div>

        <!-- File Upload Area -->
        {#if form.content_type_id !== 'youtube_video'}
          <div class="mb-6">
            <label for="edit-file" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {#if form.content_type_id === 'carousel'}
                🎠 File Carousel (Gambar & Video)
              {:else}
                📎 File
              {/if}
            </label>

            {#if form.content_type_id === 'carousel'}
              <!-- Carousel Upload Component -->
              <CarouselUpload 
                folder="carousel"
                currentFiles={selectedFiles}
                on:upload={handleCarouselUpload}
              />
            {:else}
              <!-- Current File Display -->
              {#if content.file_path && !removeExistingFile && !selectedFile}
                <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      {#if content.file_type?.startsWith('image/')}
                        <img src={content.file_path} alt="Current file" class="w-16 h-16 object-cover rounded-lg" />
                      {:else}
                        <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                          {getFileIcon({ type: content.file_type })}
                        </div>
                      {/if}
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">File saat ini: {content.file_name}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {content.file_type} • {formatFileSize(content.file_size)}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      on:click={removeFile}
                      class="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm">
                      Hapus
                    </button>
                  </div>
                </div>
              {/if}

              <!-- Removed File Notice -->
              {#if removeExistingFile && !selectedFile}
                <div class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div class="flex items-center justify-between">
                    <p class="text-red-800 dark:text-red-200">File akan dihapus saat menyimpan</p>
                    <button 
                      type="button"
                      on:click={restoreExistingFile}
                      class="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm">
                      Batalkan
                    </button>
                  </div>
                </div>
              {/if}

              <!-- S3 Upload Component -->
              <S3Upload 
                folder="content"
                maxSize={52428800}
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                on:upload={handleS3Upload}
              />
            {/if}
          </div>
        {/if}
      </div>

      <!-- Settings -->
    {#if user.is_admin}
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          ⚙️ Pengaturan
        </h2>
        
        <div class="space-y-4">
          <!-- Public/Private -->
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div>
              <div class="font-semibold text-gray-900 dark:text-white">🌍 Konten Publik</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Konten dapat dilihat oleh semua pengguna</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={form.is_public} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <!-- Featured -->
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div>
              <div class="font-semibold text-gray-900 dark:text-white">⭐ Konten Unggulan</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Tampilkan di halaman utama</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={form.is_featured} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    {/if}

      <!-- Submit Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        {#if isUploading}
          <!-- Upload Progress -->
          <div class="space-y-4">
            <div class="text-center">
              <div class="text-2xl mb-2">🔄</div>
              <div class="font-semibold text-gray-900 dark:text-white">Memperbarui konten...</div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300" style="width: {uploadProgress}%"></div>
            </div>
            <div class="text-center text-sm text-gray-500 dark:text-gray-400">
              {Math.round(uploadProgress)}% selesai
            </div>
          </div>
        {:else}
          <!-- Submit Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contents/{content.id}" use:inertia 
               class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center">
              ← Kembali
            </a>
            <button 
              type="submit"
              disabled={!form.title || !form.content_type_id}
              class="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg">
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Simpan Perubahan
              </span>
            </button>
          </div>
        {/if}
      </div>
    </form>
  </div>
</div>