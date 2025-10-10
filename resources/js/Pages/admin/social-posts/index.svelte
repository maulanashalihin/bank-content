<script>
  import { Link } from '@inertiajs/svelte';
  import Header from '../../../Components/Header.svelte';
  export let posts = []; 

  let processingId = '';

  async function verify(id, action) {
    processingId = id;
    try {
      const res = await fetch(`/admin/social-posts/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        location.reload();
      }
    } catch (e) {
      // noop
    } finally {
      processingId = '';
    }
  }
</script>

<svelte:head>
  <title>Admin - Social Posts</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Header group="social-posts-admin" />
<div class="max-w-6xl mx-auto p-4 text-gray-900 dark:text-gray-100">
  <h1 class="text-2xl font-semibold mb-4">Admin - Social Posts</h1>

  <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th class="text-left p-2">User</th>
          <th class="text-left p-2">Platform</th>
          <th class="text-left p-2">Judul</th>
          <th class="text-left p-2">URL</th>
          <th class="text-left p-2">Status</th>
          <th class="text-left p-2">Skor</th>
          <th class="text-left p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each posts as p}
          <tr class="border-t border-gray-200 dark:border-gray-700">
            <td class="p-2">{p.user_name || '-'}</td>
            <td class="p-2 capitalize">{p.platform}</td>
            <td class="p-2">{p.title || '-'}</td>
            <td class="p-2 truncate max-w-[240px]">
              <a href={p.post_url} target="_blank" class="text-emerald-600 hover:underline">{p.post_url}</a>
            </td>
            <td class="p-2">{p.status}</td>
            <td class="p-2">{p.engagement_score ?? 0}</td>
            <td class="p-2 space-x-2">
              {#if p.status === 'pending_verification'}
                <button on:click={() => verify(p.id, 'verified')} class="px-3 py-1 rounded bg-emerald-600 text-white" disabled={processingId === p.id}>Verify</button>
                <button on:click={() => verify(p.id, 'rejected')} class="px-3 py-1 rounded bg-red-600 text-white" disabled={processingId === p.id}>Reject</button>
              {:else}
                <span class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{p.status}</span>
              {/if}
              <Link href={`/admin/social-posts/${p.id}`} class="px-3 py-1 rounded bg-gray-900 text-white dark:bg-gray-700">Riwayat Metrik</Link>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>