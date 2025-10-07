<script>
  import { router } from '@inertiajs/svelte';
  
  export let content;
  export let shareInfo;

  function getContentTypeIcon(contentTypeId) {
    const icons = {
      'image': '🖼️',
      'video': '🎬',
      'blog_post': '📝',
      'email': '📧',
      'whatsapp_message': '💬',
      'short_video': '📱',
      'youtube_video': '🎥',
      'carousel': '🎠'
    };
    return icons[contentTypeId] || '📄';
  }

  function getContentTypeColor(contentTypeId) {
    const colors = {
      'image': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'video': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'blog_post': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'email': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'whatsapp_message': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'short_video': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'youtube_video': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'carousel': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[contentTypeId] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link berhasil disalin!');
  }

  function downloadContent() {
    if (content.file_path) {
      window.open(`/contents/${content.content_id}/download`, '_blank');
    }
  }
</script>

<svelte:head>
  <title>{content.title} - Shared Content</title>
  <meta name="description" content={content.content_text ? content.content_text.substring(0, 160) : 'Shared content'} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content={content.title} />
  <meta property="og:description" content={content.content_text ? content.content_text.substring(0, 160) : 'Shared content'} />
  {#if content.file_path && content.content_type_id === 'image'}
    <meta property="og:image" content={content.file_path} />
  {/if}
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={content.title} />
  <meta name="twitter:description" content={content.content_text ? content.content_text.substring(0, 160) : 'Shared content'} />
  {#if content.file_path && content.content_type_id === 'image'}
    <meta name="twitter:image" content={content.file_path} />
  {/if}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <!-- Header -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-4xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="text-2xl">{getContentTypeIcon(content.content_type_id)}</div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Konten Dibagikan</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Dibagikan oleh {shareInfo.shared_by} • {formatDate(shareInfo.shared_at)}
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            on:click={copyToClipboard}
            class="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
          
          {#if content.file_path}
            <button 
              on:click={downloadContent}
              class="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      
      <!-- Content Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {content.title}
            </h1>
            
            <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span class="px-3 py-1 rounded-full {getContentTypeColor(content.content_type_id)}">
                {getContentTypeIcon(content.content_type_id)} {content.content_type_name}
              </span>
              
              {#if content.product_name}
                <span class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  🏷️ {content.product_name}
                </span>
              {/if}
              
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {content.view_count} views
              </span>
            </div>
          </div>
        </div>

        {#if shareInfo.share_message}
          <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p class="text-purple-800 dark:text-purple-200 italic">
              💬 "{shareInfo.share_message}"
            </p>
          </div>
        {/if}
      </div>

      <!-- Media Content -->
      <div class="p-6">
        {#if content.youtube_url}
          <div class="aspect-video mb-6">
            <iframe 
              src={content.youtube_url.replace('watch?v=', 'embed/')}
              class="w-full h-full rounded-lg"
              frameborder="0"
              allowfullscreen>
            </iframe>
          </div>
        {:else if content.file_path && content.content_type_id === 'image'}
          <div class="mb-6">
            <img 
              src={content.file_path} 
              alt={content.title}
              class="w-full max-h-96 object-contain rounded-lg shadow-lg" />
          </div>
        {:else if content.file_path && (content.content_type_id === 'video' || content.content_type_id === 'short_video')}
          <div class="mb-6">
            <video 
              controls 
              class="w-full max-h-96 rounded-lg shadow-lg"
              poster={content.thumbnail_path}>
              <source src={content.file_path} type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        {/if}

        <!-- Text Content -->
        {#if content.content_text}
          <div class="prose dark:prose-invert max-w-none mb-6">
            <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {content.content_text}
            </div>
          </div>
        {/if}

        <!-- Tags -->
        {#if content.tags}
          <div class="flex flex-wrap gap-2 mb-6">
            {#each content.tags.split(',') as tag}
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                #{tag.trim()}
              </span>
            {/each}
          </div>
        {/if}

        <!-- File Info -->
        {#if content.file_path}
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">📎 File Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-600 dark:text-gray-400">Type:</span>
                <span class="ml-2 font-medium text-gray-900 dark:text-white">{content.file_type || 'Unknown'}</span>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">Size:</span>
                <span class="ml-2 font-medium text-gray-900 dark:text-white">
                  {content.file_size ? (content.file_size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'}
                </span>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">Downloads:</span>
                <span class="ml-2 font-medium text-gray-900 dark:text-white">{content.download_count}</span>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4">
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            📅 Dibuat pada {formatDate(content.created_at)}
          </div>
          <div class="flex items-center space-x-4">
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
      </div>
    </div>

    <!-- Powered by -->
    <div class="text-center mt-8">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Powered by <span class="font-semibold text-purple-600 dark:text-purple-400">Content Bank</span>
      </p>
    </div>
  </div>
</div>