<script>
    import { router, inertia } from '@inertiajs/svelte';
    import FileUpload from '../../../Components/FileUpload.svelte';
    import Header from '../../../Components/Header.svelte';
    
    export let product;
    export let error;
    export let errors = {};
    
    let form = {
        name: product.name || '',
        description: product.description || '',
        image_url: product.image_url || '',
        product_url: product.product_url || '',
        is_active: product.is_active || false
    };
    
    function submitForm() {
        router.put(`/admin/products/${product.id}`, form);
    }

    // Handle file upload success
    function handleFileUpload(event) {
        const { publicUrl } = event.detail;
        form.image_url = publicUrl;
    }

    // Handle file removal
    function handleFileRemove() {
        form.image_url = '';
    }
</script>

<Header group="admin" />

<div class="max-w-4xl mx-auto p-4">
    <div class="flex items-center mb-6">
        <a href="/admin/products/{product.id}" use:inertia 
           class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4">
            ← Kembali
        </a>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Produk</h1>
    </div>

    <!-- Error Messages -->
    {#if error}
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400 dark:bg-red-900" role="alert">
            {error}
        </div>
    {/if}

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <form on:submit|preventDefault={submitForm} class="space-y-6">
            <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Produk</label>
                <input bind:value={form.name} required type="text" name="name" id="name" 
                               class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-emerald-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                               placeholder="Masukkan nama produk">
                {#if errors.name}
                    <p class="mt-1 text-sm text-red-600">{errors.name}</p>
                {/if}
            </div>

            <div>
                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deskripsi</label>
                <textarea bind:value={form.description} name="description" id="description" rows="4" 
                                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-emerald-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                                  placeholder="Masukkan deskripsi produk"></textarea>
                {#if errors.description}
                    <p class="mt-1 text-sm text-red-600">{errors.description}</p>
                {/if}
            </div>

            <div>
                <label for="image-upload" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gambar Produk</label>
                <FileUpload 
                    folder="products"
                    currentUrl={form.image_url}
                    placeholder="Upload gambar produk"
                    on:upload={handleFileUpload}
                    on:remove={handleFileRemove}
                />
                {#if form.image_url}
                    <input type="hidden" name="image_url" value={form.image_url} />
                {/if}
                {#if errors.image_url}
                    <p class="mt-1 text-sm text-red-600">{errors.image_url}</p>
                {/if}
            </div>

            <div>
                <label for="product_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL Produk</label>
                <input bind:value={form.product_url} type="url" name="product_url" id="product_url" 
                               class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-emerald-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                               placeholder="https://example.com/product">
                {#if errors.product_url}
                    <p class="mt-1 text-sm text-red-600">{errors.product_url}</p>
                {/if}
            </div>

            <div class="flex items-center">
                <input bind:checked={form.is_active} type="checkbox" name="is_active" id="is_active" 
                               class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="is_active" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Produk Aktif</label>
            </div>

            <!-- Product Information -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Informasi Produk</h3>
                <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p><strong>ID:</strong> {product.id}</p>
                    {#if product.created_at}
                        <p><strong>Dibuat:</strong> {new Date(product.created_at).toLocaleDateString('id-ID')}</p>
                    {/if}
                    {#if product.updated_at}
                        <p><strong>Diperbarui:</strong> {new Date(product.updated_at).toLocaleDateString('id-ID')}</p>
                    {/if}
                </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                <a href="/admin/products/{product.id}" use:inertia 
                   class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                    Batal
                </a>
                <button type="submit" 
                        class="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    Update Produk
                </button>
            </div>
        </form>
    </div>
</div>