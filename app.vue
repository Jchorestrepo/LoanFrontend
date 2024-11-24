<!-- app.vue -->
<template>
  <div class="min-h-screen bg-dark-background">

    <nav class="bg-dark-surface shadow-md px-6 py-4">
      <div class="container mx-auto flex justify-between items-left">
        
        <div class="flex items-center space-x-4">
          <button @click="toggleMenu" class="text-gray-300 hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-emerald-400">Loan Manager</h1>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside v-if="isMenuOpen" class="w-full md:w-64 bg-dark-surface min-h-screen fixed left-0 top-16 p-6">
        <nav class="space-y-4">
          <NuxtLink to="/" @click="toggleMenu" class="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </NuxtLink>
          <NuxtLink to="/loans" @click="toggleMenu" class="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Préstamos</span>
          </NuxtLink>
          <NuxtLink to="/loans/create" @click="toggleMenu" class="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Préstamo</span>
          </NuxtLink>

        </nav>
      </aside>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style>
body {
  @apply bg-dark-background text-gray-300;
}

.router-link-active {
  @apply text-emerald-400;
}

@media (max-width: 768px) {
  .min-h-screen {
    min-height: auto;
  }
  
  .container {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>