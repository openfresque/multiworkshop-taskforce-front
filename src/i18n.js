import { createI18n } from 'vue-i18n'
import en from './i18n/locales/en.json'
import fr from './i18n/locales/fr.json'

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'fr', // Set the default locale
  messages: { fr }, // Other locales are lazily loaded
})

export default i18n
