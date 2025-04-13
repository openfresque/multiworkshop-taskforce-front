<template>
  <v-app-bar flat>
    <div class="d-flex align-center justify-space-between w-100 px-4">
      <!-- main logo -->
      <router-link to="/">
        <v-img
          alt="TUF logo"
          :src="currentLogo"
          width="180"
          max-height="40"
          contain
        />
      </router-link>

      <!-- navigation links (for md devices and bigger) -->
      <div class="d-none d-md-flex align-center">
        <v-btn
          v-for="link in links"
          :key="link.id"
          v-bind="link.external ? { href: link.to } : { to: link.to }"
          variant="text"
          class="mx-1"
        >
          {{ link.text }}
          <v-icon class="ml-1">{{ link.icon }}</v-icon>
        </v-btn>

        <LanguageSwitcher class="ml-2" />
      </div>

      <!-- navigation links (for small devices) -->
      <v-menu v-model="menu">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="d-flex d-md-none"
            icon
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="link in links"
            v-bind="link.external ? { href: link.to } : { to: link.to }"
            :key="link.id"
            @click="menu = false"
            :append-icon="link.icon"
            color="primary"
            :title="link.text"
          >
          </v-list-item>
          
          <v-divider class="my-2" />
          
          <v-list-item @click.stop>
            <div class="px-3 py-2 w-100">
              <LanguageSwitcher />
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useTheme } from 'vuetify'
  import { useI18n } from 'vue-i18n'
  import LanguageSwitcher from './LanguageSwitcher.vue'

  const { t } = useI18n()

  const menu = ref(false)

  const links = computed(() => [
    {
      id: 1,
      to: 'https://www.linkedin.com/company/trouver-une-fresque',
      text: t('navigation.news'),
      icon: 'mdi-newspaper',
      external: true,
    },
    { id: 2, to: '/carte', text: t('navigation.map'), icon: 'mdi-map' },
    {
      id: 3,
      to: '/apropos',
      text: t('navigation.about'),
      icon: 'mdi-information',
    },
  ])

  const theme = useTheme()

  const currentLogo = computed(() => {
    return theme.global.current.value.dark
      ? '/assets/images/svg/tuf-logo-landscape-fr.webp'
      : '/assets/images/svg/tuf-logo-landscape-fr.webp'
  })
</script>

<style scoped lang="sass">
  .toolbar-content
    max-width: 1200px
    width: 100%
    height: 100%
    margin: 0 auto
    position: relative
    
  .navigation-container
    display: inline-block
    
  .language-container
    margin-left: 16px
    height: 100%
    align-items: center
</style>
