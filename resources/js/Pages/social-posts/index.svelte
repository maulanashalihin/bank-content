<script>
  import { Link } from '@inertiajs/svelte';
  import Header from '../../Components/Header.svelte';
  export let posts = [];
</script>

<svelte:head>
  <title>Social Posts</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Header group="social-posts" />
<div class="max-w-5xl mx-auto p-4 text-gray-900 dark:text-gray-100">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-semibold">Social Posts</h1>
    <Link href="/social-posts/create" class="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Buat Baru</Link>
  </div>

  <!-- Intro: Pengenalan fitur dan benefit -->
  <div class="mb-4 rounded border p-4 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-gray-700">
    <div class="font-semibold mb-2">Apa itu Social Posts?</div>
    <p class="text-sm mb-2">Fitur ini memudahkan kamu untuk mengirim tautan posting media sosial terkait konten/produk, agar tim kami dapat memverifikasi dan melacak performanya.</p>
    <div class="text-sm">
      <span class="font-medium">Benefit:</span>
      <ul class="list-disc ml-5 mt-1 space-y-1">
        <li>Submit tautan dari berbagai platform (mis. Instagram, TikTok, YouTube).</li>
        <li>Pantau skor keterlibatan dan riwayat metrik yang tercatat.</li>
        <li>Berpeluang mendapatkan reward: cash, membership, atau token.</li>
        <li>Proses verifikasi transparan: pending, verified, atau rejected.</li>
        <li>Admin menambahkan reward setelah verifikasi sesuai performa post.</li>
      </ul>
    </div>
    <div class="mt-3">
      <Link href="/social-posts/create" class="inline-block px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Mulai dengan Buat Baru</Link>
    </div>
  </div>

  {#if posts && posts.length > 0}
    <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="text-left p-2">Platform</th>
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
              <td class="p-2 capitalize">{p.platform}</td>
              <td class="p-2">{p.title || '-'}</td>
              <td class="p-2 truncate max-w-[240px]">
                <a href={p.post_url} target="_blank" class="text-emerald-600 hover:underline">{p.post_url}</a>
              </td>
              <td class="p-2">{p.status}</td>
              <td class="p-2">{p.engagement_score ?? 0}</td>
              <td class="p-2">{p.last_synced_at ? new Date(p.last_synced_at).toLocaleString() : new Date(p.created_at).toLocaleString()}</td>
              <td class="p-2">
                <Link href={`/social-posts/${p.id}`} class="px-3 py-1 rounded bg-gray-900 text-white dark:bg-gray-700">Detail</Link>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="rounded border border-dashed p-6 text-center text-gray-500 dark:border-gray-700">
      Belum ada submission. Mulai dengan membuat satu.
    </div>
  {/if}
</div>