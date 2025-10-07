<!-- home.svelte -->
<script>
  import { inertia } from '@inertiajs/svelte'
  import { fly, fade } from 'svelte/transition'
  import { page } from '@inertiajs/svelte'
  import Header from '../Components/Header.svelte'
  
  let features = [
    {
      title: "Manajemen Konten Lengkap",
      description: "Kelola berbagai jenis konten seperti gambar, video, blog post, email template, dan WhatsApp message dalam satu platform",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-4.5A1.125 1.125 0 0110.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H5.25m0 0h2.25A2.25 2.25 0 009.75 4.5v1.5h-3a2.25 2.25 0 00-2.25 2.25v3h2.25A2.25 2.25 0 009.75 13.5h3v-3a2.25 2.25 0 00-2.25-2.25h-1.5z" />`
    },
    {
      title: "Upload & Sharing Mudah",
      description: "Upload file ke cloud storage dengan drag & drop, generate link sharing dengan tracking analytics lengkap",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />`
    },
    {
      title: "Analytics & Tracking",
      description: "Monitor performa konten dengan tracking view, download, dan share count. Analisis mendalam untuk optimasi konten",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />`
    }
  ]

  let stats = [
    { label: "Jenis Konten", value: "7+", description: "Image, Video, Blog, Email, WhatsApp, dll" },
    { label: "Cloud Storage", value: "S3", description: "Integrasi AWS S3 untuk penyimpanan aman" },
    { label: "Social Sharing", value: "6+", description: "Facebook, Twitter, LinkedIn, WhatsApp, dll" },
    { label: "Real-time", value: "100%", description: "Analytics dan tracking real-time" }
  ]
</script>

<Header group="home" />

<!-- Hero Section -->
<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
    <div class="text-center" in:fly={{ y: 20, duration: 800, delay: 200 }}>
      <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        <span class="text-emerald-600 dark:text-emerald-400">Bank Contents</span>
        <br class="hidden sm:block">
        <span class="text-3xl sm:text-5xl">Manajemen Konten Terpadu</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
        Platform lengkap untuk mengelola, menyimpan, dan membagikan berbagai jenis konten digital. 
        Dari gambar hingga video, dari blog post hingga template email - semua dalam satu tempat.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <a 
          href="/contents" 
          use:inertia
          class="px-8 py-4 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          Mulai Sekarang
        </a>
        <a
          href="/contents/create"
          use:inertia
          class="px-8 py-4 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
        >
          Upload Konten Baru
        </a>
      </div>

      <!-- Stats Section -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" in:fly={{ y: 20, duration: 800, delay: 400 }}>
        {#each stats as stat, i}
          <div class="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{stat.value}</div>
            <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">{stat.label}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">{stat.description}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- Features Section -->
<div class="py-24 bg-white dark:bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16" in:fly={{ y: 20, duration: 800 }}>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Fitur Unggulan
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Semua yang Anda butuhkan untuk mengelola konten digital dengan efisien dan profesional
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      {#each features as feature, i}
        <div 
          class="p-8 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          in:fly={{ y: 20, duration: 800, delay: 200 + (i * 100) }}
        >
          <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor" 
            class="w-8 h-8 text-emerald-600 dark:text-emerald-400"
          >
              {@html feature.icon}
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {feature.title}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Content Types Section -->
<div class="py-24 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16" in:fly={{ y: 20, duration: 800 }}>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Jenis Konten yang Didukung
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        Kelola berbagai format konten dalam satu platform
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {#each [
        { name: "Image", icon: "🖼️", desc: "JPG, PNG, SVG" },
        { name: "Video", icon: "🎬", desc: "MP4, WebM" },
        { name: "Blog Post", icon: "📝", desc: "Rich Text" },
        { name: "Email", icon: "📧", desc: "Template" },
        { name: "WhatsApp", icon: "💬", desc: "Message" },
        { name: "Short Video", icon: "📱", desc: "Social Media" },
        { name: "YouTube", icon: "🎥", desc: "Embed" }
      ] as type, i}
        <div 
          class="text-center p-4 bg-white dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow"
          in:fly={{ y: 20, duration: 600, delay: i * 50 }}
        >
          <div class="text-3xl mb-2">{type.icon}</div>
          <div class="font-medium text-gray-900 dark:text-white text-sm mb-1">{type.name}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">{type.desc}</div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- CTA Section -->
<div class="py-24 bg-emerald-600 dark:bg-emerald-700">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div in:fly={{ y: 20, duration: 800 }}>
      <h2 class="text-3xl font-bold text-white mb-4">
        Siap Mengelola Konten Anda?
      </h2>
      <p class="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
        Mulai upload, kelola, dan bagikan konten digital Anda dengan mudah. 
        Platform yang dirancang untuk efisiensi dan produktivitas maksimal.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="/contents"
          use:inertia
          class="inline-flex items-center px-8 py-4 text-emerald-600 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors shadow-lg"
        >
          Lihat Semua Konten
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 ml-2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
        <a
          href="/contents/create"
          use:inertia
          class="inline-flex items-center px-8 py-4 text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg font-medium transition-colors"
        >
          Upload Konten Baru
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 ml-2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>