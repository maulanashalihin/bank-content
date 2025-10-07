<script>
    import { router } from '@inertiajs/svelte';
    import FileUpload from '../../../Components/FileUpload.svelte';
    import Header from '../../../Components/Header.svelte';
    
    export let error;
    
    let form = {
        name: '',
        description: '',
        image_url: '',
        product_url: '',
        is_active: true,
        metadata: {}
    };
    
    function submitForm() {
        router.post('/admin/products', form);
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

<Header group="products" />

<div class="max-w-4xl mx-auto p-4">
    <div class="flex items-center mb-6">
        <a href="/admin/products" use:inertia 
           class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4">
            ← Kembali
        </a>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tambah Produk Baru</h1>
    </div>

    <!-- Error Messages -->
    {#if error}
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400 dark:bg-red-900" role="alert">
            {error}
        </div>
    {/if}

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <form on:submit|preventDefault={submitForm} class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Nama Produk -->
                        <div class="md:col-span-2">
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Nama Produk *
                            </label>
                            <input 
                                bind:value={form.name} required type="text" name="name" id="name" 
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-emerald-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                                placeholder="Masukkan nama produk">
                        </div>

            <div>
                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Deskripsi <span class="text-red-500">*</span>
                </label>
                <textarea bind:value={form.description} name="description" id="description" rows="4" 
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-emerald-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                          placeholder="Masukkan deskripsi produk"></textarea>
            </div>

                        <!-- Upload Gambar -->
                        <div class="md:col-span-2">
                            <label for="image-upload" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Gambar Produk
                            </label>
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
                        </div>

                        <!-- URL Produk -->
                        <div>
                            <label for="product_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                URL Produk
                            </label>
                            <input 
                                bind:value={form.product_url} type="url" name="product_url" id="product_url" 
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-emerald-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                                placeholder="https://example.com/product">
                        </div>

                        <!-- Status Aktif -->
                        <div class="md:col-span-2">
                            <label class="flex items-center">
                                <input 
                                    bind:checked={form.is_active} type="checkbox" name="is_active" id="is_active" 
                                    class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                
                                <span class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Produk Aktif
                                </span>
                            </label>
                        </div>
                    </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                <a href="/admin/products" use:inertia 
                   class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                    Batal
                </a>
                <button type="submit" 
                        class="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    Simpan Produk
                </button>
            </div>
        </form>
    </div>
</div>