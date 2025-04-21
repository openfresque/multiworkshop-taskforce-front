<template>
  <v-app class="app-container">
    <AppBar />
    <v-main :class="['main-content', { 'is-map-page': route.name === 'map' }]">
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router/auto'
  const route = useRoute()
</script>

<style lang="scss" scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh; // Ensure app takes at least full viewport height
  }

  .main-content {
    flex-grow: 1; // Make main content area fill available vertical space
    display: flex; // Needed for nested content potentially
    flex-direction: column; // Needed for nested content potentially

    // Default padding for non-map pages
    padding-top: 64px; // Adjust based on AppBar height
    padding-left: 16px;
    padding-right: 16px;
  }

  /* Ensure footer doesn't grow */
  footer {
    flex-shrink: 0;
  }
</style>
