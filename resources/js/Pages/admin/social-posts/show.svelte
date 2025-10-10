<script>
  import { useForm } from '@inertiajs/svelte';
  import Header from '../../../Components/Header.svelte';
  export let post;
  export let metrics = [];
  export let rewards = [];
  export let products = [];

  let metricsInput = {
    likes_count: post.likes_count ?? 0,
    comments_count: post.comments_count ?? 0,
    shares_count: post.shares_count ?? 0,
    views_count: post.views_count ?? 0,
    bookmarks_count: post.bookmarks_count ?? 0,
  };

  let metricsSaving = false;
  let metricsMessage = '';

  const saveMetrics = async () => {
    metricsSaving = true;
    metricsMessage = '';
    try {
      const res = await fetch(`/admin/social-posts/${post.id}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metricsInput),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        metricsMessage = 'Metrik diperbarui';
        if (data.aggregate) {
          Object.assign(post, data.aggregate);
        }
      } else {
        metricsMessage = data?.error || 'Gagal menyimpan metrik';
      }
    } catch (e) {
      metricsMessage = 'Terjadi kesalahan jaringan';
    } finally {
      metricsSaving = false;
    }
  };

  const rewardForm = useForm({
    product_id: products?.[0]?.id || '',
    email: '',
    reward_type: 'cash',
    reward_points: 0,
    notes: '',
  });

  // Dynamic label/unit/step based on reward type
  $: rewardLabel =
    rewardForm.reward_type === 'cash'
      ? 'Nominal (Rp)'
      : rewardForm.reward_type === 'membership'
      ? 'Durasi (hari)'
      : 'Jumlah Token';
  $: rewardUnit =
    rewardForm.reward_type === 'cash'
      ? 'rupiah'
      : rewardForm.reward_type === 'membership'
      ? 'hari'
      : 'token';
  $: rewardStep = rewardForm.reward_type === 'cash' ? 1000 : 1;

  let rewardProcessing = false;
  let rewardError = '';

  const submitReward = async () => {
    rewardProcessing = true;
    rewardError = '';
    try {
      const res = await fetch(`/admin/social-posts/${post.id}/rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: rewardForm.product_id,
          email: rewardForm.email,
          reward_type: rewardForm.reward_type,
          reward_points: Number(rewardForm.reward_points ?? 0),
          notes: rewardForm.notes || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Gagal menambah reward' }));
        rewardError = err.error || 'Gagal menambah reward';
      } else {
        location.reload();
      }
    } catch (e) {
      rewardError = 'Terjadi kesalahan jaringan';
    } finally {
      rewardProcessing = false;
    }
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
        <input type="number" min="0" bind:value={metricsInput.likes_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="comments_count" class="block text-sm text-gray-500">Comments</label>
        <input type="number" min="0" bind:value={metricsInput.comments_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="shares_count" class="block text-sm text-gray-500">Shares</label>
        <input type="number" min="0" bind:value={metricsInput.shares_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="views_count" class="block text-sm text-gray-500">Views</label>
        <input type="number" min="0" bind:value={metricsInput.views_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="bookmarks_count" class="block text-sm text-gray-500">Bookmarks</label>
        <input type="number" min="0" bind:value={metricsInput.bookmarks_count} class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
    </div>
    <div class="mt-4 flex items-center gap-3">
      <button type="button" on:click|preventDefault={saveMetrics} disabled={metricsSaving} class="px-4 py-2 rounded bg-emerald-600 text-white">{metricsSaving ? 'Menyimpan...' : 'Simpan Metrik'}</button>
      {#if metricsMessage}
        <span class="text-sm text-gray-600 dark:text-gray-300">{metricsMessage}</span>
      {/if}
    </div>
  </div>

  <div class="rounded border p-4 dark:border-gray-700">
    <h2 class="text-lg font-semibold mb-3">Rewards</h2>
    {#if rewards && rewards.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="text-left p-2">Waktu</th>
              <th class="text-left p-2">Tipe</th>
              <th class="text-left p-2">Poin</th>
              <th class="text-left p-2">Produk</th>
              <th class="text-left p-2">Email</th>
              <th class="text-left p-2">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {#each rewards as r}
              <tr class="border-t border-gray-200 dark:border-gray-700">
                <td class="p-2">{r.granted_at ? new Date(r.granted_at).toLocaleString() : '-'}</td>
                <td class="p-2 capitalize">{r.reward_type}</td>
                <td class="p-2">{r.reward_points ?? 0}</td>
                <td class="p-2">{r.product_name || r.product_id || '-'}</td>
                <td class="p-2">{r.email || '-'}</td>
                <td class="p-2">{r.notes || '-'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="rounded border border-dashed p-6 text-center text-gray-500 dark:border-gray-700">Belum ada reward untuk post ini.</div>
    {/if}

    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="product_id" class="block text-sm text-gray-500">Produk</label>
        <select bind:value={rewardForm.product_id} id="product_id" class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700">
          {#each products as p}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="email" class="block text-sm text-gray-500">Email Akun Produk</label>
        <input type="email" bind:value={rewardForm.email} id="email" class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div>
        <label for="reward_type" class="block text-sm text-gray-500">Tipe Reward</label>
        <select bind:value={rewardForm.reward_type} id="reward_type" class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700">
          <option value="cash">Cash</option>
          <option value="membership">Membership</option>
          <option value="token">Token</option>
        </select>
      </div>
      <div>
        <label for="reward_points" class="block text-sm text-gray-500">{rewardLabel}</label>
        <input
          type="number"
          min="0"
          step={rewardStep}
          bind:value={rewardForm.reward_points}
          id="reward_points"
          class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          placeholder={rewardForm.reward_type === 'cash' ? 'cth: 100000' : rewardForm.reward_type === 'membership' ? 'cth: 7' : 'cth: 500'}
        />
        <p class="mt-1 text-xs text-gray-500">Satuan: {rewardUnit}</p>
      </div>
      <div>
        <label for="notes" class="block text-sm text-gray-500">Catatan (opsional)</label>
        <input type="text" bind:value={rewardForm.notes} id="notes" class="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
      </div>
    </div>
    <div class="mt-4 flex items-center gap-3">
      <button type="button" on:click={submitReward} disabled={rewardProcessing} class="px-4 py-2 rounded bg-emerald-600 text-white">Tambah Reward</button>
      {#if rewardError}
        <span class="text-red-600 text-sm">{rewardError}</span>
      {/if}
    </div>
  </div>
</div>