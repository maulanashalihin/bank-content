<script>
  import { Link } from '@inertiajs/svelte';
  import Header from '../../Components/Header.svelte';
  export let post;
  export let history = [];

  let metrics = {
    likes_count: post.likes_count ?? 0,
    comments_count: post.comments_count ?? 0,
    shares_count: post.shares_count ?? 0,
    views_count: post.views_count ?? 0,
    bookmarks_count: post.bookmarks_count ?? 0,
  };

  let saving = false;
  let message = '';

  const canEditMetrics = post.status === 'verified';

  async function saveMetrics() {
    if (!canEditMetrics) {
      return;
    }
    saving = true;
    message = '';
    try {
      const res = await fetch(`/social-posts/${post.id}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      });
      const data = await res.json();
      if (res.ok) {
        message = 'Metrik diperbarui';
        // Update local post values
        Object.assign(post, data.aggregate || {});
      } else {
        message = data?.error || 'Gagal menyimpan metrik';
      }
    } catch (e) {
      message = 'Terjadi kesalahan jaringan';
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>Detail Social Post</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Header group="social-posts" />
<div class="max-w-3xl mx-auto p-4 text-gray-900 dark:text-gray-100 space-y-4">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Detail Social Post</h1>
    <Link href="/social-posts" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Kembali</Link>
  </div>

  <div class="rounded border p-4 dark:border-gray-700">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="text-sm text-gray-500">Platform</div>
        <div class="font-medium capitalize">{post.platform}</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Status</div>
        <div class="font-medium">{post.status}</div>
      </div>
      <div class="md:col-span-2">
        <div class="text-sm text-gray-500">URL</div>
        <a href={post.post_url} target="_blank" class="text-emerald-600 hover:underline">{post.post_url}</a>
      </div>
      <div>
        <div class="text-sm text-gray-500">Skor Keterlibatan</div>
        <div class="font-medium">{post.engagement_score ?? 0}</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Terakhir Sinkron</div>
        <div class="font-medium">{post.last_synced_at ? new Date(post.last_synced_at).toLocaleString() : '-'}</div>
      </div>
    </div>
  </div>

  <div class="rounded border p-4 dark:border-gray-700">
    <h2 class="text-lg font-semibold mb-2">Input Metrik Manual</h2>
    {#if post.status === 'pending_verification'}
      <div class="mb-3 p-3 rounded bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
        Post harus diverifikasi terlebih dahulu sebelum bisa update metrik.
      </div>
    {/if}
    {#if post.status === 'rejected'}
      <div class="mb-3 p-3 rounded bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200">
        Post ditolak. Metrik tidak dapat diedit.
      </div>
    {/if}
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div>
        <label for="likes_count" class="block text-sm mb-1">Likes</label>
        <input type="number" min="0" bind:value={metrics.likes_count} class="w-full rounded border p-2 bg-white dark:bg-gray-800" disabled={!canEditMetrics} />
      </div>
      <div>
        <label for="comments_count" class="block text-sm mb-1">Comments</label>
        <input type="number" min="0" bind:value={metrics.comments_count} class="w-full rounded border p-2 bg-white dark:bg-gray-800" disabled={!canEditMetrics} />
      </div>
      <div>
        <label for="shares_count" class="block text-sm mb-1">Shares</label>
        <input type="number" min="0" bind:value={metrics.shares_count} class="w-full rounded border p-2 bg-white dark:bg-gray-800" disabled={!canEditMetrics} />
      </div>
      <div>
        <label for="views_count" class="block text-sm mb-1">Views</label>
        <input type="number" min="0" bind:value={metrics.views_count} class="w-full rounded border p-2 bg-white dark:bg-gray-800" disabled={!canEditMetrics} />
      </div>
      <div>
        <label for="bookmarks_count" class="block text-sm mb-1">Bookmarks</label>
        <input type="number" min="0" bind:value={metrics.bookmarks_count} class="w-full rounded border p-2 bg-white dark:bg-gray-800" disabled={!canEditMetrics} />
      </div>
    </div>
    <div class="mt-3 flex items-center gap-3">
      {#if canEditMetrics}
        <button on:click|preventDefault={saveMetrics} class="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Metrik'}
        </button>
      {/if}
      {#if message}
        <span class="text-sm text-gray-600 dark:text-gray-300">{message}</span>
      {/if}
    </div>
  </div>
  <div class="rounded border p-4 dark:border-gray-700">
    <h2 class="text-lg font-semibold mb-2">Riwayat Metrik</h2>
    {#if history && history.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="text-left p-2">Waktu</th>
              <th class="text-left p-2">Sumber</th>
              <th class="text-left p-2">Likes</th>
              <th class="text-left p-2">Comments</th>
              <th class="text-left p-2">Shares</th>
              <th class="text-left p-2">Views</th>
              <th class="text-left p-2">Bookmarks</th>
              <th class="text-left p-2">Skor</th>
            </tr>
          </thead>
          <tbody>
            {#each history as m}
              <tr class="border-t border-gray-200 dark:border-gray-700">
                <td class="p-2">{m.captured_at ? new Date(m.captured_at).toLocaleString() : '-'}</td>
                <td class="p-2">{m.source || '-'}</td>
                <td class="p-2">{m.likes_count ?? 0}</td>
                <td class="p-2">{m.comments_count ?? 0}</td>
                <td class="p-2">{m.shares_count ?? 0}</td>
                <td class="p-2">{m.views_count ?? 0}</td>
                <td class="p-2">{m.bookmarks_count ?? 0}</td>
                <td class="p-2">{m.engagement_score ?? 0}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="rounded border border-dashed p-6 text-center text-gray-500 dark:border-gray-700">
        Belum ada riwayat metrik.
      </div>
    {/if}
  </div>
</div>