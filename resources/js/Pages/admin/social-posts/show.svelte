<script>
  import { useForm } from '@inertiajs/svelte';
  import Header from '../../../Components/Header.svelte';
  export let post;
  export let metrics = [];

  const form = useForm({
    likes_count: post.likes_count ?? 0,
    comments_count: post.comments_count ?? 0,
    shares_count: post.shares_count ?? 0,
    views_count: post.views_count ?? 0,
    bookmarks_count: post.bookmarks_count ?? 0,
  });

  const submit = () => {
    form.post(`/admin/social-posts/${post.id}/metrics`, {
      preserveScroll: true,
      onSuccess: () => {
        // No-op, server returns JSON; consider flash via inertia in future
      },
    });
  };
</script>

<svelte:head>
  <title>Admin - Detail Social Post</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Header group="social-posts-admin" />
<div class="max-w-6xl mx-auto p-4 text-gray-900 dark:text-gray-100 space-y-6">
  <div class="rounded border p-4 dark:border-gray-700">
    <h1 class="text-2xl font-semibold mb-4">Detail Social Post</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <div class="text-sm text-gray-500">User</div>
        <div class="font-medium">{post.user_name || '-'}</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Platform</div>
        <div class="font-medium capitalize">{post.platform}</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Status</div>
        <div class="font-medium">{post.status}</div>
      </div>
      <div class="md:col-span-3">
        <div class="text-sm text-gray-500">URL</div>
        <a href={post.post_url} target="_blank" class="text-emerald-600 hover:underline">{post.post_url}</a>
      </div>
    </div>
  </div>

  <div class="rounded border p-4 dark:border-gray-700">
    <h2 class="text-lg font-semibold mb-3">Riwayat Metrik</h2>
    {#if metrics && metrics.length > 0}
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
            {#each metrics as m}
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

  <div class="rounded border p-4 dark:border-gray-700">
    <h2 class="text-lg font-semibold mb-3">Tambah/Update Metrik Manual</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="likes_count" class="block text-sm text-gray-500">Likes</label>
        <input type="number" min="0" bind:value={form.likes_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="comments_count" class="block text-sm text-gray-500">Comments</label>
        <input type="number" min="0" bind:value={form.comments_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="shares_count" class="block text-sm text-gray-500">Shares</label>
        <input type="number" min="0" bind:value={form.shares_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="views_count" class="block text-sm text-gray-500">Views</label>
        <input type="number" min="0" bind:value={form.views_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="bookmarks_count" class="block text-sm text-gray-500">Bookmarks</label>
        <input type="number" min="0" bind:value={form.bookmarks_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
    </div>
    <div class="mt-4 flex items-center gap-3">
      <button on:click={submit} disabled={form.processing} class="px-4 py-2 rounded bg-emerald-600 text-white">Simpan Metrik</button>
      {#if form.errors && Object.keys(form.errors).length > 0}
        <span class="text-red-600 text-sm">Terjadi kesalahan input.</span>
      {/if}
    </div>
  </div>
</div>