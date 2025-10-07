<script>
    import { router } from '@inertiajs/svelte';
    import Header from '../../../Components/Header.svelte';
    
    export let user;
    export let success;
    export let error;
    
    let showDeleteModal = false;
    let deleting = false;
    
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
    
    function confirmDelete() {
        showDeleteModal = true;
    }
    
    function cancelDelete() {
        showDeleteModal = false;
    }
    
    function deleteUser() {
        if (deleting) return;
        
        deleting = true;
        router.delete(`/admin/users/${user.id}`, {
            onFinish: () => {
                deleting = false;
                showDeleteModal = false;
            },
            onSuccess: () => {
                // Will redirect to users list
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
            }
        });
    }
</script>

<Header group="users" />

<div class="max-w-4xl mx-auto p-4">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
            <a href="/admin/users" use:inertia class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Detail User</h1>
        </div>
        
        <div class="flex space-x-3">
            <a href="/admin/users/{user.id}/edit" use:inertia 
               class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
            </a>
            <button 
                on:click={confirmDelete}
                class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Hapus
            </button>
        </div>
    </div>

    <!-- Success Message -->
    {#if success}
        <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:text-green-400 dark:bg-green-900" role="alert">
            {success}
        </div>
    {/if}

    <!-- Error Message -->
    {#if error}
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400 dark:bg-red-900" role="alert">
            {error}
        </div>
    {/if}

    <!-- User Information Card -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <!-- Header with Avatar -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
            <div class="flex items-center">
                <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div class="ml-6 text-white">
                    <h2 class="text-2xl font-bold">{user.name}</h2>
                    <p class="text-blue-100">{user.email}</p>
                    <div class="flex items-center mt-2 space-x-2">
                        {#if user.is_verified}
                            <span class="bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">Terverifikasi</span>
                        {:else}
                            <span class="bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">Belum Terverifikasi</span>
                        {/if}
                        {#if user.is_admin}
                            <span class="bg-yellow-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">Admin</span>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <!-- User Details -->
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Basic Information -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Dasar</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600 dark:text-gray-400">ID User:</span>
                            <span class="text-gray-900 dark:text-white font-mono text-sm">{user.id}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600 dark:text-gray-400">Nama Lengkap:</span>
                            <span class="text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                            <span class="text-gray-900 dark:text-white">{user.email}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600 dark:text-gray-400">Nomor Telepon:</span>
                            <span class="text-gray-900 dark:text-white">{user.phone || '-'}</span>
                        </div>
                    </div>
                </div>

                <!-- Account Status -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Akun</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="font-medium text-gray-600 dark:text-gray-400">Status Verifikasi:</span>
                            {#if user.is_verified}
                                <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    ✓ Terverifikasi
                                </span>
                            {:else}
                                <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    ✗ Belum Terverifikasi
                                </span>
                            {/if}
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="font-medium text-gray-600 dark:text-gray-400">Role:</span>
                            {#if user.is_admin}
                                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    👑 Administrator
                                </span>
                            {:else}
                                <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300">
                                    👤 User Biasa
                                </span>
                            {/if}
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600 dark:text-gray-400">Dibuat:</span>
                            <span class="text-gray-900 dark:text-white text-sm">{formatDate(user.created_at)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600 dark:text-gray-400">Terakhir Diupdate:</span>
                            <span class="text-gray-900 dark:text-white text-sm">{formatDate(user.updated_at)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Information -->
            {#if user.email_verified_at || user.remember_token}
                <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Tambahan</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {#if user.email_verified_at}
                            <div class="flex justify-between">
                                <span class="font-medium text-gray-600 dark:text-gray-400">Email Diverifikasi:</span>
                                <span class="text-gray-900 dark:text-white text-sm">{formatDate(user.email_verified_at)}</span>
                            </div>
                        {/if}
                        {#if user.remember_token}
                            <div class="flex justify-between">
                                <span class="font-medium text-gray-600 dark:text-gray-400">Remember Token:</span>
                                <span class="text-gray-900 dark:text-white font-mono text-xs">
                                    {user.remember_token.substring(0, 20)}...
                                </span>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" on:click={cancelDelete}>
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" on:click|stopPropagation>
            <div class="mt-3 text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                    <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">Hapus User</h3>
                <div class="mt-2 px-7 py-3">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Apakah Anda yakin ingin menghapus user <strong>{user.name}</strong>? 
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>
                <div class="items-center px-4 py-3">
                    <div class="flex justify-center space-x-4">
                        <button 
                            on:click={cancelDelete}
                            class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                            Batal
                        </button>
                        <button 
                            on:click={deleteUser}
                            disabled={deleting}
                            class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400 flex items-center">
                            {#if deleting}
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menghapus...
                            {:else}
                                Hapus
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}