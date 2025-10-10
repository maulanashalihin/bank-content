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
      <input type="url" bind:value={form.post_url} placeholder="https://..." class="w-full rounded border p-2 bg-white dark:bg-gray-800" required />
    </div>
 

    <button type="submit" class="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700" disabled={form.processing}>
      {form.processing ? 'Mengirim...' : 'Kirim'}
    </button>
  </form>
</div>