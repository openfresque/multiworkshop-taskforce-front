<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { RemoteConfig } from './utils/RemoteConfig'

  onMounted(async () => {
    await RemoteConfig.INSTANCE.sync()
  })
</script>
