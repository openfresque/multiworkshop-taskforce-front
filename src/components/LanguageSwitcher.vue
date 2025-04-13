<template>
  <select @change="switchLanguage">
    <option
      v-for="sLocale in supportedLocales"
      :key="`locale-${sLocale}`"
      :value="sLocale"
      :selected="locale === sLocale"
    >
      {{ t(`locale.${sLocale}`) }}
    </option>
  </select>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Translation from '@/i18n/translation'

  const { t, locale } = useI18n()
  const supportedLocales = Translation.supportedLocales

  const switchLanguage = async event => {
    const newLocale = event.target.value
    await Translation.switchLanguage(newLocale)
  }
</script>
