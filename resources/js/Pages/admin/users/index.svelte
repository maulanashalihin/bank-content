<script>
    import { inertia, router } from '@inertiajs/svelte';
    import Header from '../../../Components/Header.svelte';
    
    export let users = [];
    export let pagination = {};
    export let search = '';
    export let success;
    export let error;
    
    let searchQuery = search;
    
    function deleteUser(id) {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(`/admin/users/${id}`);
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
    
    function handleSearch() {
        router.get('/admin/users', { search: searchQuery }, { preserveState: true });
    }
    
    function clearSearch() {
        searchQuery = '';
        router.get('/admin/users', {}, { preserveState: true });
    }
</script>

<Header group="users" />

<div class="max-w-7xl mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Manajemen Users</h1>
        <a href="/admin/users/create" use:inertia 
           class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            Tambah User
        </a>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
        <div class="flex gap-2">
            <div class="flex-1">
                <input 
                    bind:value={searchQuery}
                    on:keydown={(e) => e.key === 'Enter' && handleSearch()}
                    type="text" 
                    placeholder="Cari berdasarkan nama, email, atau telepon..."
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <button 
                on:click={handleSearch}
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                Cari
            </button>
            {#if search}
                <button 
                    on:click={clearSearch}
                    class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
                    Clear
                </button>
            {/if}
        </div>
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

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            User
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Telepon
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Role
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Tanggal Daftar
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                <div>
                                    <div class="font-semibold">{user.name}</div>
                                    <div class="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                {user.email}
                            </td>
                            <td class="px-6 py-4">
                                {user.phone || '-'}
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-medium rounded-full {user.is_verified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}">
                                    {user.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-medium rounded-full {user.is_admin ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}">
                                    {user.is_admin ? 'Admin' : 'User'}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                {formatDate(user.created_at)}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex space-x-2">
                                    <a href="/admin/users/{user.id}" use:inertia 
                                       class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300">
                                        Lihat
                                    </a>
                                    <a href="/admin/users/{user.id}/edit" use:inertia
                                       class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                                        Edit
                                    </a>
                                    {#if !user.is_admin}
                                        <button on:click={() => deleteUser(user.id)}
                                                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                            Hapus
                                        </button>
                                    {/if}
                                </div>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                {#if search}
                                    Tidak ada user yang ditemukan untuk pencarian "{search}". 
                                    <button on:click={clearSearch} class="text-emerald-600 hover:underline">Hapus filter</button>
                                {:else}
                                    Belum ada user. <a href="/admin/users/create" use:inertia class="text-emerald-600 hover:underline">Tambah user pertama</a>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        {#if pagination && pagination.total_pages > 1}
            <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700 dark:text-gray-300">
                        Menampilkan {((pagination.current_page - 1) * pagination.per_page) + 1} sampai {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} dari {pagination.total_items} user
                    </div>
                    <div class="flex space-x-1">
                        {#if pagination.current_page > 1}
                            <a href="?page={pagination.current_page - 1}{search ? '&search=' + encodeURIComponent(search) : ''}" use:inertia
                               class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                Sebelumnya
                            </a>
                        {/if}
                        
                        {#each Array.from({length: pagination.total_pages}, (_, i) => i + 1) as page}
                            {#if page === pagination.current_page}
                                <span class="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-gray-300 dark:bg-gray-700 dark:text-white">
                                    {page}
                                </span>
                            {:else if Math.abs(page - pagination.current_page) <= 2 || page === 1 || page === pagination.total_pages}
                                <a href="?page={page}{search ? '&search=' + encodeURIComponent(search) : ''}" use:inertia
                                   class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    {page}
                                </a>
                            {:else if Math.abs(page - pagination.current_page) === 3}
                                <span class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                    ...
                                </span>
                            {/if}
                        {/each}
                        
                        {#if pagination.current_page < pagination.total_pages}
                            <a href="?page={pagination.current_page + 1}{search ? '&search=' + encodeURIComponent(search) : ''}" use:inertia
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