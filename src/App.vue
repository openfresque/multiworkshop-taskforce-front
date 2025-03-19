<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useTheme } from 'vuetify'
  import { RemoteConfig } from './utils/RemoteConfig'

  const theme = useTheme()

  onMounted(async () => {
    await RemoteConfig.INSTANCE.sync()

    // Set theme based on user preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.global.name.value = prefersDark ? 'dark' : 'light'
  })
</script>
