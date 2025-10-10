<script>
  import { Link } from '@inertiajs/svelte';
  import Header from '../../../Components/Header.svelte';
  import PlatformIcon from '../../../Components/PlatformIcon.svelte';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/id';
  export let posts = []; 
  dayjs.extend(relativeTime);
  dayjs.locale('id');

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

  function formatSyncTime(ts) {
    const d = dayjs(ts);
    const days = dayjs().diff(d, 'day');
    return days <= 7 ? d.fromNow() : d.format('DD/MM/YYYY, HH:mm');
  }
</script>

<svelte:head>
  <title>Admin - Social Posts</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Header group="social-posts-admin" />
<div class="max-w-7xl mx-auto p-4 text-gray-900 dark:text-gray-100">
  <h1 class="text-2xl font-semibold mb-4">Admin - Social Posts</h1>

  <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th class="text-left p-2">User</th>
          <th class="text-left p-2">SM</th>
          <th class="text-left p-2">Judul</th>
          <th class="text-left p-2">URL</th>
          <th class="text-left p-2">Status</th>
          <th class="text-left p-2">Skor</th>
          <th class="text-left p-2">Terakhir Sinkron</th>
          <th class="text-left p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each posts as p}
          <tr class="border-t border-gray-200 dark:border-gray-700">
            <td class="p-2">{p.user_name || '-'}</td>
            <td class="p-2"><PlatformIcon platform={p.platform} /></td>
            <td class="p-2 truncate max-w-[240px]">{p.title || '-'}</td>
            <td class="p-2 truncate max-w-[240px]">
              <a href={p.post_url} target="_blank" class="text-emerald-600 hover:underline">{p.post_url}</a>
            </td>
            <td class="p-2">{p.status}</td>
            <td class="p-2">{p.engagement_score ?? 0}</td>
            <td class="p-2">{formatSyncTime(p.last_synced_at || p.created_at)}</td>
            <td class="p-2">
              <div class="flex items-center gap-2 flex-wrap">
                {#if p.status === 'pending_verification'}
                  <button
                    on:click={() => verify(p.id, 'verified')}
                    class="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    disabled={processingId === p.id}
                  >Verify</button>
                  <button
                    on:click={() => verify(p.id, 'rejected')}
                    class="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    disabled={processingId === p.id}
                  >Reject</button>
                {:else}
                  <span class={`px-2 py-1 text-xs rounded ${
                    p.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                      : p.status === 'rejected'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {p.status}
                  </span>
                {/if}
                <Link href={`/admin/social-posts/${p.id}`} class="px-2 py-1 text-xs rounded bg-gray-900 text-white dark:bg-gray-700">show</Link>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>