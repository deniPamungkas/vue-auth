<script setup>
import Toaster from './components/ui/toast/Toaster.vue';

</script>

<template>
  <div class="p-5">
    <nav>
      <h1 class="text-xl md:text-3xl font-semibold text-center">Vue Authentication</h1>
    </nav>
    <main>
      <RouterView />
      <Toaster />
    </main>
  </div>

</template>

<style scoped></style>
