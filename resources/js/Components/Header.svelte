<script>
  import { fly } from 'svelte/transition';
  import { page, router, inertia } from '@inertiajs/svelte';
  import { clickOutside } from '../Components/helper';
  import DarkModeToggle from './DarkModeToggle.svelte';
    import LajuIcon from './LajuIcon.svelte';

  let user = $page.props.user;
 
  let isMenuOpen = false;
  let isUserMenuOpen = false;

  export let group; 

  const menuLinks = [
    { href: '/home', label: 'Beranda', group: 'home', show : true },  
    { href: '/contents', label: 'Konten', group: 'contents', show : true },
    { href: '/admin/products', label: 'Kelola Produk', group: 'products', show : user && user.is_admin },
    { href: '/admin/users', label: 'Kelola User', group: 'users', show : user && user.is_admin }, 
  ];
 
  

  function isActive(path) {
    return currentPath === path;
  }

  function handleLogout() {
    router.post('/logout');
  }
</script>

<header class="bg-white/80  dark:bg-gray-900 dark:border-b dark:border-gray-700  backdrop-blur-md fixed w-full z-50 shadow-sm" 
  in:fly={{ y: -20, duration: 1000, delay: 200 }}>
  <nav
    class=" mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between"
  >
    <a href="/"   class="flex items-center space-x-2 sm:space-x-3">
        <img class="w-8 h-8 " src="/apple-icon-144x144.png" alt="">
      <span class="text-xl sm:text-2xl font-bold gradient-text">Bank Content</span>
    </a> 
    
    <!-- Desktop Menu -->
    <div class="hidden md:flex  lg:space-x-4">
      {#each menuLinks.filter((item) => item.show) as item}
        <a 
        
          href={item.href} 
          class="nav-link dark:text-gray-200 dark:hover:dark:text-gray-100 dark:hover:bg-gray-800 {item.group === group ? 'active dark:bg-gray-800' : ''}"
        >
          {item.label}
        </a>
      {/each}
    </div>
    
    <div class="flex items-center">
      <DarkModeToggle />
      
      
      <!-- Auth Buttons -->
      <div class="hidden sm:flex items-center space-x-3 dark:text-gray-300">
        {#if user && user.id}
          <div class="relative" use:clickOutside on:click_outside={() => isUserMenuOpen = false}>
            <button 
              class="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg dark:hover:bg-gray-800"
              on:click={() => isUserMenuOpen = !isUserMenuOpen}
            >
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-medium">{user.name[0].toUpperCase()}</span>
              </div>
              <span class="font-medium">{user.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {#if isUserMenuOpen}
              <div 
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 dark:bg-gray-800 dark:text-gray-300"
                transition:fly={{ y: -10, duration: 200 }}
              >
                <a href="/profile/{user.username}" use:inertia class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
                <a href="/profile" use:inertia class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Profile</a>
                
                {#if user.is_admin}
                  <div class="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                  <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin
                  </div>
                  <a href="/admin/products" use:inertia class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div class="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      <span>Kelola Produk</span>
                    </div>
                  </a>
                  <a href="/admin/contents" use:inertia class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div class="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span>Kelola Konten</span>
                    </div>
                  </a>
                  <a href="/admin/users" use:inertia class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div class="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      <span>Kelola User</span>
                    </div>
                  </a>
                {/if}
                
                <div class="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                <a href="/settings" use:inertia class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
                <button 
                  on:click={handleLogout}
                  class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <a href="/login" class="btn-secondary text-sm">Masuk</a>
          <a href="/register" class="btn-primary text-sm">Daftar</a>
        {/if}
      </div>
      
      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
        on:click={() => isMenuOpen = !isMenuOpen}
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          {#if !isMenuOpen}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
          {:else}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
          {/if}
        </svg>
      </button>
    </div>
  </nav>
  
  <!-- Mobile Menu -->
  {#if isMenuOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div  
    use:clickOutside on:click_outside={() => isMenuOpen = false}
    class="fixed inset-0 bg-black/20   backdrop-blur-sm z-50 md:hidden {isMenuOpen ? 'block' : 'hidden'}"
    on:click={() => (isMenuOpen = false)}
  >
    <div
      class="absolute right-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg"
      on:click|stopPropagation
    >
      <div class="flex flex-col p-4 space-y-4">
        {#each menuLinks.filter((item) => item.show) as item}
          <a 
            href={item.href} 
            class="mobile-nav-link dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white {item.group === group ? 'active' : ''}"
          >
            {item.label}
          </a>
        {/each}
      </div>
      <div class="px-4 py-3 border-t dark:border-gray-700 border-gray-200">
        <div class="flex items-center space-x-3">
          {#if user}
            <button 
              class="flex-1 btn-secondary dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400 text-sm py-2"
              on:click={handleLogout}
            >
              Logout
            </button>
          {:else}
            <a href="/login" class="flex-1 btn-secondary text-sm py-2">Masuk</a>
            <a href="/register" class="flex-1 btn-primary text-sm py-2">Daftar</a>
          {/if}
        </div>
      </div>
    </div>
  </div>
  {/if}
</header>
<div class="mb-16">
  <br>
</div>

 