<script>
  import { Link, useForm, router } from '@inertiajs/svelte'; 
  import Header from '../../Components/Header.svelte';
  export let platforms = [];

  const form = useForm({
    title: '',
    platform: platforms?.[0] ?? 'instagram',
    post_url: ''
  });

  function submit(e) {
    e.preventDefault();
    router.post('/social-posts', form);
  }
</script>

<svelte:head>
  <title>Buat Social Post</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Header group="social-posts" />
<div class="max-w-2xl mx-auto p-4 text-gray-900 dark:text-gray-100">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-semibold">Buat Social Post</h1>
    <Link href="/social-posts" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Kembali</Link>
  </div>

  <!-- Panduan singkat pembuatan Social Post -->
  <div class="mb-4 rounded border p-4 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-gray-700">
    <div class="font-semibold mb-2">Panduan Singkat</div>
    <p class="text-sm mb-2">Kirim tautan posting media sosial yang relevan dengan konten/produk agar dapat diverifikasi dan dilacak performanya.</p>
    <div class="text-sm">
      <span class="font-medium">Tips & Ketentuan:</span>
      <ul class="list-disc ml-5 mt-1 space-y-1">
        <li>Pastikan posting <span class="font-medium">publik</span> dan dapat diakses tanpa login.</li>
        <li>Gunakan URL langsung ke posting (contoh: Instagram/TikTok/YouTube), hindari URL yang dipendekkan.</li>
        <li>Tulis <span class="font-medium">judul</span> yang ringkas dan representatif.</li>
        <li>Setelah dikirim, status akan menjadi <span class="italic">pending_verification</span> sampai tim memverifikasi.</li>
        <li>Skor keterlibatan dihitung dari metrik; reward (cash/membership/token) ditentukan admin sesuai performa.</li>
      </ul>
    </div>
    <div class="mt-3">
      <Link href="/social-posts" class="inline-block px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Lihat Daftar Social Posts</Link>
    </div>
  </div>

  <form on:submit={submit} class="space-y-4">
    <div>
      <label for="title" class="block mb-1">Judul</label>
      <input type="text" bind:value={form.title} placeholder="Judul postingan" class="w-full rounded border p-2 bg-white dark:bg-gray-800" required />
    </div>
    <div>
      <label for="platform" class="block mb-1">Platform</label>
      <select bind:value={form.platform} class="w-full rounded border p-2 bg-white dark:bg-gray-800">
        {#each platforms as p}
          <option value={p}>{p}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="post_url" class="block mb-1">URL Post</label>
      <input type="url" bind:value={form.post_url} placeholder="https://contoh.com/post/123" class="w-full rounded border p-2 bg-white dark:bg-gray-800" required />
      <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">Pastikan URL publik dan langsung ke posting.</p>
    </div>
 

    <button type="submit" class="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700" disabled={form.processing}>
      {form.processing ? 'Mengirim...' : 'Kirim'}
    </button>
  </form>
</div>