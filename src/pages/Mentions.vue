<template>
  <v-container max-width="1200px">
    <div class="px-5">
      <h2 class="text-h2 text-primary mb-6">{{ t('legal_mentions.title') }}</h2>
      <div
        v-for="key in sections"
        :key="key"
      >
        <h3 v-html="t(`legal_mentions.sections.${key}.title`)"></h3>
        <p v-html="t(`legal_mentions.sections.${key}.content`)"></p>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const sections = ['edition', 'personal_data', 'license']
</script>

<route>
{
  name: 'legal',
  //path: '/:locale?/mentions-legales'
  path: '/mentions-legales'
}
</route>
