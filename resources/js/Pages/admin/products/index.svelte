<script>
    import { inertia, router } from '@inertiajs/svelte';
    import Header from '../../../Components/Header.svelte';
    
    export let products = [];
    export let pagination = {};
    export let success;
    export let error;
    
    function deleteProduct(id) {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(`/admin/products/${id}`);
        }
    }
    
    function formatDate(timestamp) {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
</script>

<Header group="products" />

<div class="max-w-7xl mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Manajemen Produk</h1>
        <a href="/admin/products/create" use:inertia 
               class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                Tambah Produk
            </a>
    </div>

    <!-- Success/Error Messages -->
    {#if success}
        <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:text-green-400 dark:bg-green-900" role="alert">
            {success}
        </div>
    {/if}

    {#if error}
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400 dark:bg-red-900" role="alert">
            {error}
        </div>
    {/if}

    <!-- Products Table -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Produk
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Deskripsi
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Tanggal Dibuat
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each products as product}
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                <div class="flex items-center">
                                    {#if product.image_url}
                                        <img class="h-10 w-10 rounded-lg object-cover mr-3" src={product.image_url} alt={product.name} />
                                    {/if}
                                    <div>
                                        <div class="font-semibold">{product.name}</div>
                                        {#if product.sku}
                                            <div class="text-xs text-gray-500">SKU: {product.sku}</div>
                                        {/if}
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="max-w-xs truncate">
                                    {product.description || '-'}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-medium rounded-full {product.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}">
                                    {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                {new Date(product.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex space-x-2">
                                    <a href="/admin/products/{product.id}" use:inertia 
                                   class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300">
                                    {product.name}
                                </a>
                                    <a href="/admin/products/{product.id}/edit" use:inertia
                                       class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                                        Edit
                                    </a>
                                    <button on:click={() => deleteProduct(product.id)}
                                            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                        Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                Belum ada produk. <a href="/admin/products/create" use:inertia class="text-emerald-600 hover:underline">Tambah produk pertama</a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        {#if pagination && pagination.total > pagination.per_page}
            <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700 dark:text-gray-300">
                        Menampilkan {pagination.from} sampai {pagination.to} dari {pagination.total} produk
                    </div>
                    <div class="flex space-x-1">
                        {#if pagination.current_page > 1}
                            <a href="?page={pagination.current_page - 1}" use:inertia
                               class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                Sebelumnya
                            </a>
                        {/if}
                        
                        {#each Array.from({length: pagination.last_page}, (_, i) => i + 1) as page}
                            {#if page === pagination.current_page}
                                <span class="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-gray-300 dark:bg-gray-700 dark:text-white">
                                    {page}
                                </span>
                            {:else if Math.abs(page - pagination.current_page) <= 2 || page === 1 || page === pagination.last_page}
                                <a href="?page={page}" use:inertia
                                   class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    {page}
                                </a>
                            {:else if Math.abs(page - pagination.current_page) === 3}
                                <span class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                    ...
                                </span>
                            {/if}
                        {/each}
                        
                        {#if pagination.current_page < pagination.last_page}
                            <a href="?page={pagination.current_page + 1}" use:inertia
                               class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                Selanjutnya
                            </a>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>