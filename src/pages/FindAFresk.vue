<template>
  <v-container max-width="1200px">
    <!-- search card section -->
    <section class="px-4">
      <v-card class="search-card pa-2 pa-sm-10 mt-12 mb-12">
        <v-card-title
          class="d-flex justify-center"
          max-width="600px"
        >
          <h2
            style="text-wrap-mode: wrap; max-width: 600px; text-align: center"
          >
            {{ t('welcome') }}
          </h2>
        </v-card-title>
        <v-card-text class="d-flex align-center justify-center">
          <div
            class="d-flex flex-column flex-sm-row"
            style="max-width: 600px; width: 100%"
          >
            <v-select
              class="w-100 mb-1 mb-sm-0 mr-sm-1"
              v-model="selectedFlag"
              :items="['France 🇫🇷', 'Switzerland 🇨🇭']"
              variant="solo"
              hide-details
              density="comfortable"
            ></v-select>
            <SearchField
              class="d-flex flex-grow-1 w-100"
              :autofocus="true"
            ></SearchField>
          </div>
        </v-card-text>
      </v-card>
    </section>

    <!-- logo section -->
    <LogoWall />

    <!-- Q&A section -->
    <QnA />
  </v-container>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SearchField from '@/components/SearchField.vue'
  import LogoWall from '@/components/LogoWall.vue'
  import QnA from '@/components/QnA.vue'

  const { t } = useI18n()
  const selectedFlag = ref('France 🇫🇷')
  watch(selectedFlag, newVal => {
    if (newVal === 'Switzerland 🇨🇭') {
      window.open('https://oneplanetfriends.org/', '_blank')
      selectedFlag.value = 'France 🇫🇷'
    }
  })
</script>

<style lang="scss" scoped>
  .search-card {
    background: linear-gradient(
      45deg,
      rgba(var(--v-theme-primary), 0.6),
      rgba(var(--v-theme-secondary), 0.6) 33%,
      rgba(var(--v-theme-info), 0.6) 66%,
      rgba(var(--v-theme-success), 0.6)
    );
  }
</style>
