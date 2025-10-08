<script>
    import { router } from '@inertiajs/svelte';
    import Header from '../../../Components/Header.svelte';
    
    export let error;
    
    let form = {
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
        is_verified: false
    };
    
    let errors = {};
    let loading = false;
    
    function submitForm() {
        if (loading) return;
        
        // Basic validation
        errors = {};
        
        if (!form.name.trim()) {
            errors.name = 'Nama wajib diisi';
        }
        
        if (!form.email.trim()) {
            errors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'Format email tidak valid';
        }
        
        if (!form.password.trim()) {
            errors.password = 'Password wajib diisi';
        } else if (form.password.length < 6) {
            errors.password = 'Password minimal 6 karakter';
        }
        
        if (form.password !== form.password_confirmation) {
            errors.password_confirmation = 'Konfirmasi password tidak cocok';
        }
        
        if (Object.keys(errors).length > 0) {
            return;
        }
        
        loading = true;
        
        router.post('/admin/users', form, {
            onFinish: () => {
                loading = false;
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            }
        });
    }
</script>
 
<Header group="users" />

<div class="max-w-4xl mx-auto p-4">
    <div class="flex items-center mb-6">
        <a href="/admin/users" use:inertia class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mr-4" aria-label="Kembali ke daftar user">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
        </a>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tambah User Baru</h1>
    </div>

    <!-- Error Message -->
    {#if error}
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400 dark:bg-red-900" role="alert">
            {error}
        </div>
    {/if}

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <form on:submit|preventDefault={submitForm} class="space-y-6">
            <!-- Name -->
            <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input 
                    bind:value={form.name}
                    type="text" 
                    id="name" 
                    name="name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white {errors.name ? 'border-red-500' : ''}"
                    placeholder="Masukkan nama lengkap"
                    required
                />
                {#if errors.name}
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                {/if}
            </div>

            <!-- Email -->
            <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email <span class="text-red-500">*</span>
                </label>
                <input 
                    bind:value={form.email}
                    type="email" 
                    id="email" 
                    name="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white {errors.email ? 'border-red-500' : ''}"
                    placeholder="user@example.com"
                    required
                />
                {#if errors.email}
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                {/if}
            </div>

            <!-- Phone -->
            <div>
                <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nomor Telepon
                </label>
                <input 
                    bind:value={form.phone}
                    type="tel" 
                    id="phone" 
                    name="phone"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="08123456789"
                />
            </div>

            <!-- Password -->
            <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password <span class="text-red-500">*</span>
                </label>
                <input 
                    bind:value={form.password}
                    type="password" 
                    id="password" 
                    name="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white {errors.password ? 'border-red-500' : ''}"
                    placeholder="••••••••"
                    required
                />
                {#if errors.password}
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                {/if}
            </div>

            <!-- Password Confirmation -->
            <div>
                <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Konfirmasi Password <span class="text-red-500">*</span>
                </label>
                <input 
                    bind:value={form.password_confirmation}
                    type="password" 
                    id="password_confirmation" 
                    name="password_confirmation"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white {errors.password_confirmation ? 'border-red-500' : ''}"
                    placeholder="••••••••"
                    required
                />
                {#if errors.password_confirmation}
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                {/if}
            </div>

            <!-- Checkboxes -->
            <div class="space-y-4">
                <div class="flex items-center">
                    <input 
                        bind:checked={form.is_verified}
                        id="is_verified" 
                        type="checkbox" 
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="is_verified" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        User sudah terverifikasi
                    </label>
                </div>

                <div class="flex items-center">
                    <input 
                        bind:checked={form.is_admin}
                        id="is_admin" 
                        type="checkbox" 
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="is_admin" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Jadikan sebagai Admin
                    </label>
                </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-4 pt-6">
                <a href="/admin/users" use:inertia 
                   class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
                    Batal
                </a>
                <button 
                    type="submit" 
                    disabled={loading}
                    class="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center">
                    {#if loading}
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                    {:else}
                        Simpan User
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>