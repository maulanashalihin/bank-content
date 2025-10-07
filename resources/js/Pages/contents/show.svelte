<script>
  import { router, inertia } from '@inertiajs/svelte';
  import Header from '../../Components/Header.svelte';

  export let content = {};
  export let relatedContents = [];

  let showShareModal = false;
  let shareUrl = '';
  let copySuccess = false;
  let shareMessage = '';

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      'image': 'bg-purple-100 text-purple-800',
      'video': 'bg-red-100 text-red-800',
      'blog_post': 'bg-blue-100 text-blue-800',
      'email': 'bg-green-100 text-green-800',
      'whatsapp_message': 'bg-emerald-100 text-emerald-800',
      'short_video': 'bg-pink-100 text-pink-800',
      'youtube_video': 'bg-orange-100 text-orange-800',
      'carousel': 'bg-indigo-100 text-indigo-800'
    };
    return colors[contentType] || 'bg-gray-100 text-gray-800';
  }

  function openShareModal() {
    shareUrl = window.location.href;
    showShareModal = true;
  }

  function closeShareModal() {
    showShareModal = false;
    copySuccess = false;
    shareMessage = '';
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  async function shareToSocial(platform) {
    try {
      const response = await fetch(`/contents/${content.id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          share_platform: platform,
          share_message: shareMessage
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const shareUrl = result.share_url;
        const text = shareMessage || `Check out this content: ${content.title}`;
        
        let url = '';
        switch(platform) {
          case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
          case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
            break;
          case 'linkedin':
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
            break;
          case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
            break;
          case 'telegram':
            url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
            break;
          case 'email':
            url = `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
            break;
        }
        
        if (url) {
          window.open(url, '_blank', 'width=600,height=400');
          closeShareModal();
          
          // Update share count in UI
          content.share_count = (content.share_count || 0) + 1;
        }
      } else {
        alert('Gagal membuat link sharing');
      }
    } catch (error) {
      console.error('Error sharing content:', error);
      alert('Terjadi kesalahan saat sharing');
    }
  }

  async function downloadContent() {
    if (content.file_path) {
      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = content.file_path;
      link.download = content.file_name || 'download';
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Call server to increment download counter
      try {
        const response = await fetch(`/contents/${content.id}/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.download_count) {
            // Update download count in UI
            content.download_count = data.download_count;
          }
        }
      } catch (error) {
        console.error('Error updating download count:', error);
      }
    }
  }

  function deleteContent() {
    if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
      router.delete(`/contents/${content.id}`);
    }
  }

  function getTags() {
    if (!content.tags) return [];
    return content.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
  }
</script>

<Header group="contents" />

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Back Button -->
    <div class="mb-6">
      <a href="/contents" use:inertia 
         class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Kembali ke Gallery
      </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Content Header -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <span class="px-3 py-1 text-sm font-semibold rounded-full {getContentTypeColor(content.content_type_id)}">
                  {getContentTypeIcon(content.content_type_id)} {content.content_type_name}
                </span>
                {#if content.product_name}
                  <span class="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    🏷️ {content.product_name}
                  </span>
                {/if}
                {#if content.is_featured}
                  <span class="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                    ⭐ Unggulan
                  </span>
                {/if}
              </div>
              
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {content.title}
              </h1>
              
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  {content.user_name}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {formatDate(content.created_at)}
                </span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button 
                on:click={openShareModal}
                class="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Bagikan">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </button>
              
              {#if content.file_path}
                <button 
                  on:click={downloadContent}
                  class="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  title="Download">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </button>
              {/if}
              
              <a href="/contents/{content.id}/edit" use:inertia 
                 class="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                 title="Edit">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </a>
              
              <button 
                on:click={deleteContent}
                class="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                title="Hapus">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Content Media -->
        {#if content.carousel_files && content.carousel_files.length > 0}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              🎠 Carousel Media
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each content.carousel_files as file, index}
                <div class="relative group">
                  {#if file.type?.startsWith('image/')}
                    <img 
                      src={file.url} 
                      alt={file.filename || `Carousel image ${index + 1}`}
                      class="w-full h-48 object-cover rounded-lg shadow-lg transition-transform group-hover:scale-105"
                    />
                  {:else if file.type?.startsWith('video/')}
                    <video 
                      src={file.url}
                      class="w-full h-48 object-cover rounded-lg shadow-lg"
                      controls>
                      Browser Anda tidak mendukung video.
                    </video>
                  {:else}
                    <div class="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                      <div class="text-center">
                        <div class="text-4xl mb-2">📄</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">{file.filename}</div>
                      </div>
                    </div>
                  {/if}
                  <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {file.filename || `File ${index + 1}`}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {:else if content.youtube_url}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div class="aspect-video">
              <iframe 
                src={getYouTubeEmbedUrl(content.youtube_url)}
                class="w-full h-full rounded-lg"
                frameborder="0"
                allowfullscreen
                title={content.title}>
              </iframe>
            </div>
          </div>
        {:else if content.file_path && content.file_type?.startsWith('image/')}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <img 
              src={content.file_path} 
              alt={content.title}
              class="w-full rounded-lg shadow-lg"
            />
          </div>
        {:else if content.file_path && content.file_type?.startsWith('video/')}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <video 
              src={content.file_path}
              class="w-full rounded-lg shadow-lg"
              controls>
              Browser Anda tidak mendukung video.
            </video>
          </div>
        {/if}

        <!-- Content Text -->
        {#if content.content_text}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              📄 Konten
            </h2>
            <div class="prose prose-lg dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {content.content_text}
              </p>
            </div>
          </div>
        {/if}

        <!-- Tags -->
        {#if getTags().length > 0}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              🏷️ Tag
            </h2>
            <div class="flex flex-wrap gap-2">
              {#each getTags() as tag}
                <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  #{tag}
                </span>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        
        <!-- Stats -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            📊 Statistik
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="flex items-center text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Views
              </span>
              <span class="font-semibold text-gray-900 dark:text-white">{content.view_count || 0}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Downloads
              </span>
              <span class="font-semibold text-gray-900 dark:text-white">{content.download_count || 0}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
                Shares
              </span>
              <span class="font-semibold text-gray-900 dark:text-white">{content.share_count || 0}</span>
            </div>
          </div>
        </div>

        <!-- File Info -->
        {#if content.file_path}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              📎 File Info
            </h2>
            <div class="space-y-3">
              {#if content.file_name}
                <div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Nama File:</span>
                  <p class="font-medium text-gray-900 dark:text-white">{content.file_name}</p>
                </div>
              {/if}
              {#if content.file_type}
                <div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Tipe:</span>
                  <p class="font-medium text-gray-900 dark:text-white">{content.file_type}</p>
                </div>
              {/if}
              {#if content.file_size}
                <div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Ukuran:</span>
                  <p class="font-medium text-gray-900 dark:text-white">{(content.file_size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Related Contents -->
        {#if relatedContents.length > 0}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              🔗 Konten Terkait
            </h2>
            <div class="space-y-3">
              {#each relatedContents as related}
                <a href="/contents/{related.id}" use:inertia 
                   class="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div class="flex items-center space-x-3">
                    <div class="text-2xl">{getContentTypeIcon(related.content_type_id)}</div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-gray-900 dark:text-white truncate">{related.title}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{related.content_type_name}</p>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Share Modal -->
{#if showShareModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">📤 Bagikan Konten</h3>
        <button 
          on:click={closeShareModal}
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Share Message -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Pesan (Opsional)
        </label>
        <textarea 
          bind:value={shareMessage}
          placeholder="Tambahkan pesan untuk sharing..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          rows="3">
        </textarea>
      </div>

      <!-- Share URL -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Link Konten
        </label>
        <div class="flex">
          <input 
            type="text" 
            value={shareUrl}
            readonly
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <button 
            on:click={copyToClipboard}
            class="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors text-sm">
            {copySuccess ? '✓' : '📋'}
          </button>
        </div>
        {#if copySuccess}
          <p class="text-sm text-green-600 dark:text-green-400 mt-1">Link berhasil disalin!</p>
        {/if}
      </div>

      <!-- Social Share Buttons -->
      <div class="space-y-3">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Bagikan ke:</p>
        <div class="grid grid-cols-2 gap-3">
          <button 
            on:click={() => shareToSocial('whatsapp')}
            class="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <span class="mr-2">💬</span>
            WhatsApp
          </button>
          <button 
            on:click={() => shareToSocial('telegram')}
            class="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <span class="mr-2">✈️</span>
            Telegram
          </button>
          <button 
            on:click={() => shareToSocial('twitter')}
            class="flex items-center justify-center px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
            <span class="mr-2">🐦</span>
            Twitter
          </button>
          <button 
            on:click={() => shareToSocial('facebook')}
            class="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <span class="mr-2">📘</span>
            Facebook
          </button>
          <button 
            on:click={() => shareToSocial('linkedin')}
            class="flex items-center justify-center px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <span class="mr-2">💼</span>
            LinkedIn
          </button>
          <button 
            on:click={() => shareToSocial('email')}
            class="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <span class="mr-2">📧</span>
            Email
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}