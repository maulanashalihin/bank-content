<script>
  import { router, inertia } from '@inertiajs/svelte';
  import Header from '../../Components/Header.svelte';

  export let contents = [];
  export let products = [];
  export let contentTypes = [];
  export let filters = {};
  export let pagination = {};

  let searchQuery = filters.search || '';
  let selectedProduct = filters.product_id || '';
  let selectedContentType = filters.content_type_id || '';
  let sortBy = filters.sort_by || 'created_at';
  let sortOrder = filters.sort_order || 'desc';

  // Filter handling
  function applyFilters() {
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (selectedProduct) params.append('product_id', selectedProduct);
    if (selectedContentType) params.append('content_type_id', selectedContentType);
    if (sortBy) params.append('sort_by', sortBy);
    if (sortOrder) params.append('sort_order', sortOrder);
    params.append('page', '1'); // Reset to first page when filtering
    
    router.get('/contents', Object.fromEntries(params));
  }

  function clearFilters() {
    searchQuery = '';
    selectedProduct = '';
    selectedContentType = '';
    sortBy = 'created_at';
    sortOrder = 'desc';
    router.get('/contents');
  }

  // Auto-apply filters when values change
  function handleFilterChange() {
    // Debounce search to avoid too many requests
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      applyFilters();
    }, 500);
  }

  let searchTimeout;

  // Handle pagination
  function goToPage(page) {
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (selectedProduct) params.append('product_id', selectedProduct);
    if (selectedContentType) params.append('content_type_id', selectedContentType);
    if (sortBy) params.append('sort_by', sortBy);
    if (sortOrder) params.append('sort_order', sortOrder);
    params.append('page', page.toString());
    
    router.get('/contents', Object.fromEntries(params));
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getContentTypeIcon(contentType) {
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
    return icons[contentType] || '📄';
  }

  function getContentTypeColor(contentType) {
    const colors = {
      'image': 'bg-emerald-100 text-emerald-800',
      'video': 'bg-teal-100 text-teal-800',
      'blog_post': 'bg-emerald-100 text-emerald-800',
      'email': 'bg-green-100 text-green-800',
      'whatsapp_message': 'bg-emerald-100 text-emerald-800',
      'short_video': 'bg-pink-100 text-pink-800',
      'youtube_video': 'bg-orange-100 text-orange-800',
      'carousel': 'bg-indigo-100 text-indigo-800'
    };
    return colors[contentType] || 'bg-gray-100 text-gray-800';
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
      'image': 'bg-emerald-100 text-emerald-800',
      'video': 'bg-teal-100 text-teal-800',
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

  function truncateText(text, maxLength = 100) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
</script>

<Header group="contents" />

<div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Header Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        🎨 Content Gallery
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Temukan dan kelola semua konten kreatif Anda dalam satu tempat
      </p>
      
      <!-- Create Content Button -->
      <a href="/contents/create"  
         class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Buat Konten Baru
      </a>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔍 Cari Konten
          </label>
          <div class="relative">
            <input 
              bind:value={searchQuery}
              on:input={handleFilterChange}
              type="text" 
              placeholder="Cari berdasarkan judul, konten, atau tag..."
              class="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {#if searchQuery}
              <button 
                on:click={() => { searchQuery = ''; handleFilterChange(); }}
                class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            {/if}
          </div>
        </div>

        <!-- Product Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🏷️ Produk
          </label>
          <select 
            bind:value={selectedProduct}
            on:change={applyFilters}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Semua Produk</option>
            {#each products as product}
              <option value={product.id}>{product.name}</option>
            {/each}
          </select>
        </div>

        <!-- Content Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📂 Jenis Konten
          </label>
          <select 
            bind:value={selectedContentType}
            on:change={applyFilters}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Semua Jenis</option>
            {#each contentTypes as type}
              <option value={type.id}>{getContentTypeInfo(type.id).icon} {type.display_name}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Sort and Actions -->
      <div class="flex flex-col md:flex-row gap-4 mt-6">
        <!-- Sort By -->
        <div class="w-full md:w-48">
          <select 
            bind:value={sortBy}
            on:change={applyFilters}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="created_at">📅 Terbaru</option>
            <option value="title">🔤 Judul A-Z</option>
            <option value="view_count">👁️ Paling Dilihat</option>
            <option value="download_count">⬇️ Paling Diunduh</option>
            <option value="share_count">📤 Paling Dibagikan</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div class="w-full md:w-32">
          <select 
            bind:value={sortOrder}
            on:change={applyFilters}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="desc">⬇️ Turun</option>
            <option value="asc">⬆️ Naik</option>
          </select>
        </div>

        <!-- Clear Filters -->
        {#if searchQuery || selectedProduct || selectedContentType || sortBy !== 'created_at' || sortOrder !== 'desc'}
          <button 
            on:click={clearFilters}
            class="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Reset
          </button>
        {/if}
      </div>
    </div>

    <!-- Popular Tags Quick Filter -->
    {#if contents && contents.length > 0}
      {@const allTags = contents.flatMap(content => content.tags ? content.tags.split(',').map(tag => tag.trim()) : []).filter(tag => tag)}
      {@const tagCounts = allTags.reduce((acc, tag) => { acc[tag] = (acc[tag] || 0) + 1; return acc; }, {})}
      {@const popularTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)}
      
      {#if popularTags.length > 0}
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            🏷️ Tag Populer
          </h3>
          <div class="flex flex-wrap gap-2">
            {#each popularTags as [tag, count]}
              <button 
                on:click={() => { searchQuery = tag; handleFilterChange(); }}
                class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 rounded-full text-sm hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1">
                {tag}
                <span class="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-full px-2 py-0.5 text-xs">
                  {count}
                </span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    {/if}

    <!-- Content Grid -->
    {#if contents.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {#each contents as content}
          <a href="/contents/{content.id}"   class="group block">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer">
              
              <!-- Content Preview -->
              <div class="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center">
                {#if content.file_path && (content.content_type_id === 'image')}
                  <img src={content.file_path} alt={content.title} class="w-full h-full object-cover" />
                {:else if content.youtube_url}
                  <div class="text-6xl">🎬</div>
                {:else}
                  <div class="text-6xl">{getContentTypeIcon(content.content_type_id)}</div>
                {/if}
                
                <!-- Content Type Badge -->
                <div class="absolute top-3 left-3">
                  <span class="px-3 py-1 text-xs font-semibold rounded-full {getContentTypeColor(content.content_type_id)}">
                    {content.content_type_name}
                  </span>
                </div>

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="bg-white bg-opacity-90 rounded-full p-3">
                      <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            <!-- Content Info -->
            <div class="p-5">
              <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                {content.title}
              </h3>
              
              {#if content.content_text}
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                  {truncateText(content.content_text)}
                </p>
              {/if}

              {#if content.product_name}
                <div class="flex items-center mb-3">
                  <span class="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-1 rounded-full">
                    🏷️ {content.product_name}
                  </span>
                </div>
              {/if}

              <!-- Stats -->
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <div class="flex items-center space-x-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {content.view_count}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    {content.download_count}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                    </svg>
                    {content.share_count}
                  </span>
                </div>
              </div>

              <!-- Author & Date -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  👤 {content.user_name}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  📅 {formatDate(content.created_at)}
                </span>
              </div>
            </div>
          </div>
        </a>
        {/each}
      </div>

      <!-- Pagination -->
      {#if pagination.last_page > 1}
        <div class="flex justify-center mt-12">
          <div class="flex items-center space-x-2">
            <!-- Previous Button -->
            <button 
              on:click={() => goToPage(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              class="px-3 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <!-- Page Numbers -->
            {#each Array(Math.min(pagination.last_page, 7)) as _, i}
              {@const pageNum = pagination.current_page <= 4 ? i + 1 : pagination.current_page - 3 + i}
              {#if pageNum <= pagination.last_page && pageNum > 0}
                <button 
                  on:click={() => goToPage(pageNum)}
                  class="px-4 py-2 rounded-lg font-medium transition-colors border {pagination.current_page === pageNum ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'}">
                  {pageNum}
                </button>
              {/if}
            {/each}

            <!-- Next Button -->
            <button 
              on:click={() => goToPage(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              class="px-3 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Pagination Info -->
        <div class="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          Halaman {pagination.current_page} dari {pagination.last_page} 
          ({pagination.total} total konten)
        </div>
      {/if}

    {:else}
      <!-- Empty State -->
      <div class="text-center py-16">
        <div class="text-8xl mb-6">📝</div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Belum Ada Konten
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Mulai buat konten pertama Anda dan bagikan kreativitas dengan dunia!
        </p>
        <a href="/contents/create"   
           class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Buat Konten Pertama
        </a>
      </div>
    {/if}
  </div>
</div>