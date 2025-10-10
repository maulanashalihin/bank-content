<script>
  import { router, inertia } from '@inertiajs/svelte';
  import Header from '../../Components/Header.svelte';
  import CarouselUpload from '../../Components/CarouselUpload.svelte';
  import S3Upload from '../../Components/S3Upload.svelte';

  export let products = [];
  export let contentTypes = [];
  export let user;

  let form = {
    title: '',
    content_text: '',
    product_id: '',
    content_type_id: '',
    youtube_url: '',
    tags: '',
    is_public: true,
    is_featured: false
  };

  let selectedFile = null;
  let selectedFiles = []; // For carousel multiple files
  let uploadProgress = 0;
  let isUploading = false;



  // Handle carousel upload from CarouselUpload component
  function handleCarouselUpload(event) {
    selectedFiles = event.detail.files;
  }

  // Handle S3 upload from S3Upload component
  function handleS3Upload(event) {
    selectedFile = event.detail.file;
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

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        uploadProgress += Math.random() * 30;
        if (uploadProgress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200);

      // Use JSON submission for all content types
      router.post('/contents', submitData, {
        onSuccess: () => {
          uploadProgress = 100;
          setTimeout(() => {
            clearInterval(progressInterval);
            isUploading = false;
          }, 500);
        },
        onError: (errors) => {
          console.error('Create failed:', errors);
          clearInterval(progressInterval);
          isUploading = false;
          uploadProgress = 0;
        }
      });
    } catch (error) {
      isUploading = false;
      uploadProgress = 0;
    }
  }
</script>

<Header group="contents" />

<div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        ✨ Buat Konten Baru
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        Bagikan kreativitas Anda dengan dunia!
      </p>
    </div>

    <form on:submit|preventDefault={submitForm} class="space-y-8">
      
      <!-- Content Type Selection -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          🎯 Pilih Jenis Konten
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
            <label for="content-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ✏️ Judul Konten *
            </label>
            <input 
              id="content-title"
              bind:value={form.title}
              type="text" 
              required
              placeholder="Berikan judul yang menarik untuk konten Anda..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Product -->
          <div>
            <label for="content-product" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🏷️ Produk Terkait
            </label>
            <select 
              id="content-product"
              bind:value={form.product_id}
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Pilih Produk (Opsional)</option>
              {#each products as product}
                <option value={product.id}>{product.name}</option>
              {/each}
            </select>
          </div>

          <!-- Tags -->
          <div>
            <label for="content-tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🏷️ Tag
            </label>
            <input 
              id="content-tags"
              bind:value={form.tags}
              type="text" 
              placeholder="marketing, email, promo (pisahkan dengan koma)"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <label for="youtube-url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎬 URL YouTube
            </label>
            <input 
              id="youtube-url"
              bind:value={form.youtube_url}
              type="url" 
              placeholder="https://www.youtube.com/watch?v=..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        {/if}

        <!-- Text Content -->
        <div class="mb-6">
          <label for="content-text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📄 Konten Teks
          </label>
          <textarea 
            id="content-text"
            bind:value={form.content_text}
            rows="6"
            placeholder="Tulis konten Anda di sini... Bisa berupa deskripsi, copy email, caption, atau konten lainnya."
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          ></textarea>
        </div>

        <!-- File Upload Area -->
        {#if form.content_type_id !== 'youtube_video'}
          <div class="mb-6">
            <!-- svelte-ignore a11y_no_native_role -->
            <label for="file-upload" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {#if form.content_type_id === 'carousel'}
                🎠 File Carousel (Gambar & Video)
              {:else}
                📎 File (Opsional)
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
              <!-- S3 Upload Component for single file -->
              <S3Upload 
                folder="uploads"
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                maxSize={50 * 1024 * 1024}
                placeholder="Pilih file untuk diupload"
                currentFile={selectedFile}
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
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
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
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
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
              <div class="text-2xl mb-2">🚀</div>
              <div class="font-semibold text-gray-900 dark:text-white">Mengupload konten...</div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-gradient-to-r from-emerald-600 to-teal-600 h-3 rounded-full transition-all duration-300" style="width: {uploadProgress}%"></div>
            </div>
            <div class="text-center text-sm text-gray-500 dark:text-gray-400">
              {Math.round(uploadProgress)}% selesai
            </div>
          </div>
        {:else}
          <!-- Submit Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contents" use:inertia 
               class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center">
              ← Kembali
            </a>
            <button 
              type="submit"
              disabled={!form.title || !form.content_type_id}
              class="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg">
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                Publikasikan Konten
              </span>
            </button>
          </div>
        {/if}
      </div>
    </form>
  </div>
</div>