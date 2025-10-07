<script>
    import { inertia } from '@inertiajs/svelte';
    import Header from '../../../Components/Header.svelte';
    
    export let product;
    
    function formatDate(timestamp) {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
</script>

<Header group="products" />

<div class="max-w-4xl mx-auto p-4">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
            <a href="/admin/products" use:inertia 
               class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4">
                ← Kembali
            </a>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Detail Produk</h1>
        </div>
        <div class="flex space-x-3">
            <a href="/admin/products/{product.id}/edit" use:inertia
               class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                Edit Produk
            </a>
        </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <!-- Product Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
                    {#if product.sku}
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">SKU: {product.sku}</p>
                    {/if}
                    <div class="flex items-center space-x-4">
                        <span class="px-3 py-1 text-sm font-medium rounded-full {product.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}">
                            {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                        {#if product.price}
                            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatPrice(product.price)}
                            </span>
                        {/if}
                    </div>
                </div>
                {#if product.image_url}
                    <div class="ml-6">
                        <img src={product.image_url} 
                             alt={product.name}
                             class="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600">
                    </div>
                {/if}
            </div>
        </div>

        <!-- Product Details -->
        <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Informasi Produk</h3>
                            <div class="space-y-3">
                                <div>
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Nama:</span>
                                    <p class="text-gray-900 dark:text-white">{product.name}</p>
                                </div>
                                <div>
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi:</span>
                                    <p class="text-gray-900 dark:text-white">{product.description || '-'}</p>
                                </div>
                                <div>
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                                    <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full {product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                        {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Dibuat:</span>
                                    <p class="text-gray-900 dark:text-white">{formatDate(product.created_at)}</p>
                                </div>
                                <div>
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Diperbarui:</span>
                                    <p class="text-gray-900 dark:text-white">{formatDate(product.updated_at)}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Media & Links</h3>
                            <div class="space-y-3">
                                {#if product.image_url}
                                    <div>
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Gambar:</span>
                                        <div class="mt-2">
                                            <img src={product.image_url} alt={product.name} class="h-32 w-32 object-cover rounded-lg">
                                        </div>
                                    </div>
                                {/if}
                                {#if product.product_url}
                                    <div>
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">URL Produk:</span>
                                    <a href={product.product_url} target="_blank" class="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 break-all">
                                        {product.product_url}
                                    </a>
                                </div>
                                {/if}
                                {#if product.metadata}
                                    <div>
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Metadata:</span>
                                        <pre class="text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 overflow-auto">
{JSON.stringify(JSON.parse(product.metadata), null, 2)}
                                        </pre>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>

            <!-- Description -->
            {#if product.description}
                <div class="mt-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Deskripsi</h3>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{product.description}</p>
                    </div>
                </div>
            {/if}

            <!-- URLs -->
            {#if product.image_url || product.product_url}
                <div class="mt-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Link</h3>
                    <div class="space-y-2">
                        {#if product.image_url}
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Gambar</label>
                                <a href={product.image_url} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all">
                                    {product.image_url}
                                </a>
                            </div>
                        {/if}
                        {#if product.product_url}
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Produk</label>
                                <a href={product.product_url} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all">
                                    {product.product_url}
                                </a>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}

            <!-- Metadata -->
            {#if product.metadata}
                <div class="mt-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Metadata</h3>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{JSON.stringify(JSON.parse(product.metadata), null, 2)}</pre>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>