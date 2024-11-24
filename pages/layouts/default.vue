<template>
    <div class="bg-dark-background text-dark-primary min-h-screen">
      <Navbar />
      <div class="flex">
        <Sidebar />
        <main class="flex-1 p-6 ml-64">
          <slot />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  //import Navbar from '~/frontend/components/Layout/Navbar.vue'
  //import Sidebar from '~/frontend/components/Layout/Sidebar.vue'
  </script>
  
  <style>
  body {
    @apply bg-dark-background text-dark-primary;
  }
  </style>