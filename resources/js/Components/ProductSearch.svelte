<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { page } from '@inertiajs/svelte';
    
    const dispatch = createEventDispatcher();
    
    export let selectedProduct = null;
    export let placeholder = "Cari produk...";
    export let disabled = false;
    export let required = false;
    export let showImage = true;
    export let showPrice = true;
    export let allowClear = true;
    
    let searchQuery = '';
    let searchResults = [];
    let isLoading = false;
    let isOpen = false;
    let searchTimeout;
    let searchInput;
    let dropdownContainer;
    

    
    // Debounced search function
    function handleSearch() {
        clearTimeout(searchTimeout);
        
        if (searchQuery.trim().length < 2) {
            searchResults = [];
            isOpen = false;
            return;
        }
        
        searchTimeout = setTimeout(async () => {
            isLoading = true;
            try {
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
                if (response.ok) {
                    const data = await response.json();
                    searchResults = data.products || [];
                    isOpen = searchResults.length > 0;
                } else {
                    searchResults = [];
                    isOpen = false;
                }
            } catch (error) {
                console.error('Error searching products:', error);
                searchResults = [];
                isOpen = false;
            } finally {
                isLoading = false;
            }
        }, 300);
    }
    
    // Select product
    function selectProduct(product) {
        selectedProduct = product;
        searchQuery = product.name;
        isOpen = false;
        searchResults = [];
        dispatch('select', product);
    }
    
    // Clear selection
    function clearSelection() {
        selectedProduct = null;
        searchQuery = '';
        isOpen = false;
        searchResults = [];
        dispatch('clear');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Handle input focus
    function handleFocus() {
        if (searchQuery.trim().length >= 2) {
            isOpen = searchResults.length > 0;
        }
    }
    
    // Handle click outside
    function handleClickOutside(event) {
        if (dropdownContainer && !dropdownContainer.contains(event.target)) {
            isOpen = false;
        }
    }
    
    // Handle keyboard navigation
    function handleKeydown(event) {
        if (event.key === 'Escape') {
            isOpen = false;
            searchInput.blur();
        }
    }
    
    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
            clearTimeout(searchTimeout);
        };
    });
    
    // Watch for external changes to selectedProduct
    $: if (selectedProduct) {
        searchQuery = selectedProduct.name;
    }
</script>

<div class="relative" bind:this={dropdownContainer}>
    <div class="relative">
        <input
            bind:this={searchInput}
            bind:value={searchQuery}
            on:input={handleSearch}
            on:focus={handleFocus}
            {disabled}
            {required}
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-emerald-600 focus:outline-none block w-full py-2.5 px-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            {placeholder}
            autocomplete="off"
        />
        
        <!-- Loading spinner -->
        {#if isLoading}
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        {:else if selectedProduct && allowClear}
            <!-- Clear button -->
            <button
                type="button"
                aria-label="Hapus pilih produk"
                on:click={clearSelection}
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        {:else if !selectedProduct}
            <!-- Search icon -->
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        {/if}
    </div>
    
    <!-- Dropdown results -->
    {#if isOpen && searchResults.length > 0}
        <div class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {#each searchResults as product}
                <button
                    type="button"
                    on:click={() => selectProduct(product)}
                    class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
                >
                    <div class="flex items-center space-x-3">
                        {#if showImage && product.image_url}
                            <img
                                src={product.image_url}
                                alt={product.name}
                                class="w-10 h-10 object-cover rounded border border-gray-200 dark:border-gray-600"
                                on:error={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        {:else if showImage}
                            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        {/if}
                        
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {product.name}
                                </h3>
                            </div>
                            
                            {#if product.description}
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {product.description}
                                </p>
                            {/if}
                        </div>
                        
                        {#if showPrice && product.price}
                            <div class="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {formatPrice(product.price)}
                            </div>
                        {/if}
                    </div>
                </button>
            {/each}
        </div>
    {:else if isOpen && searchResults.length === 0 && !isLoading && searchQuery.trim().length >= 2}
        <div class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                Tidak ada produk ditemukan untuk "{searchQuery}"
            </div>
        </div>
    {/if}
</div>

<!-- Selected product display (optional) -->
{#if selectedProduct}
    <div class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex items-center space-x-3">
            {#if showImage && selectedProduct.image_url}
                <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    class="w-12 h-12 object-cover rounded border border-blue-200 dark:border-blue-700"
                    on:error={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            {/if}
            
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {selectedProduct.name}
                </p>
                {#if selectedProduct.brand}
                    <p class="text-xs text-blue-700 dark:text-blue-300">
                        {selectedProduct.brand}
                    </p>
                {/if}
                {#if showPrice && selectedProduct.price}
                    <p class="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        {formatPrice(selectedProduct.price)}
                    </p>
                {/if}
            </div>
            
            {#if allowClear}
                <button
                    type="button"
                    aria-label="Hapus pilih produk"
                    on:click={clearSelection}
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            {/if}
        </div>
    </div>
{/if}