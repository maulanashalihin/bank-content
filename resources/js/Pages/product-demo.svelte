<script>
    import ProductSearch from '../Components/ProductSearch.svelte';
    import Header from '../Components/Header.svelte';
    
    let selectedProduct = null;
    let selectedProducts = [];
    
    function handleProductSelect(event) {
        selectedProduct = event.detail;
        console.log('Product selected:', selectedProduct);
    }
    
    function handleProductClear() {
        selectedProduct = null;
        console.log('Product selection cleared');
    }
    
    function addToList() {
        if (selectedProduct && !selectedProducts.find(p => p.id === selectedProduct.id)) {
            selectedProducts = [...selectedProducts, selectedProduct];
            selectedProduct = null;
        }
    }
    
    function removeFromList(productId) {
        selectedProducts = selectedProducts.filter(p => p.id !== productId);
    }
    

</script>

<Header group="contents" />

<div class="max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Demo Product Search Component</h1>
    
    <!-- Basic Product Search -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pencarian Produk</h2>
        
        <div class="space-y-4">
            <div>
                <!-- svelte-ignore a11y_no_native_role -->
                <label for="product-search" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Pilih Produk
                </label>
                <ProductSearch
                    bind:selectedProduct
                    on:select={handleProductSelect}
                    on:clear={handleProductClear}
                    placeholder="Ketik untuk mencari produk..."
                    required
                />
            </div>
            
            {#if selectedProduct}
                <div class="flex space-x-4">
                    <button
                        on:click={addToList}
                        class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        Tambah ke Daftar
                    </button>
                </div>
            {/if}
        </div>
    </div>
    
    <!-- Product Search Variations -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Without Image -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tanpa Gambar</h3>
            <ProductSearch
                placeholder="Cari produk tanpa gambar..."
                showImage={false}
            />
        </div>
        
        <!-- Without Price -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tanpa Harga</h3>
            <ProductSearch
                placeholder="Cari produk tanpa harga..."
                showPrice={false}
            />
        </div>
    </div>
    
    <!-- Selected Products List -->
    {#if selectedProducts.length > 0}
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Daftar Produk Terpilih ({selectedProducts.length})
            </h2>
            
            <div class="space-y-3">
                {#each selectedProducts as product}
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="flex items-center space-x-4">
                            {#if product.image_url}
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    class="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-600"
                                    on:error={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            {:else}
                                <div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            {/if}
                            
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                                    {product.name}
                                </h3>
                                {#if product.description}
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {product.description}
                                    </p>
                                {/if}
                            </div>
                        </div>
                        
                        <!-- svelte-ignore a11y_no_native_role -->
                        <button
                            aria-label="Hapus produk dari daftar"
                            on:click={() => removeFromList(product.id)}
                            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                {/each}
            </div>
            
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-gray-900 dark:text-white">
                        Total: {selectedProducts.length} produk
                    </span>
                    <button
                        on:click={() => selectedProducts = []}
                        class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                        Hapus Semua
                    </button>
                </div>
            </div>
        </div>
    {/if}
    
    <!-- Usage Instructions -->
    <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 mt-6">
        <h2 class="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-3">
            Cara Menggunakan ProductSearch Component
        </h2>
        
        <div class="text-sm text-emerald-800 dark:text-emerald-200 space-y-2">
            <p><strong>Import:</strong> <code class="bg-emerald-100 dark:bg-emerald-800 px-1 rounded">import ProductSearch from '../Components/ProductSearch.svelte';</code></p>
            
            <p><strong>Props yang tersedia:</strong></p>
            <ul class="list-disc list-inside ml-4 space-y-1">
                <li><code>selectedProduct</code> - Produk yang dipilih (bind:selectedProduct)</li>
                <li><code>placeholder</code> - Placeholder text untuk input</li>
                <li><code>disabled</code> - Disable input</li>
                <li><code>required</code> - Input wajib diisi</li>
                <li><code>showImage</code> - Tampilkan gambar produk (default: true)</li>
                <li><code>showPrice</code> - Tampilkan harga produk (default: true)</li>
                <li><code>allowClear</code> - Izinkan clear selection (default: true)</li>
            </ul>
            
            <p><strong>Events:</strong></p>
            <ul class="list-disc list-inside ml-4 space-y-1">
                <li><code>on:select</code> - Dipanggil ketika produk dipilih</li>
                <li><code>on:clear</code> - Dipanggil ketika selection dibersihkan</li>
            </ul>
        </div>
    </div>
</div>