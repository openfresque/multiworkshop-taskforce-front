import i18n from '@/i18n'

const Translation = {
  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(',')
  },

  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale
  },

  async switchLanguage(newLocale) {
    Translation.currentLocale = newLocale
    document.querySelector('html').setAttribute('lang', newLocale)
  },
}

export default Translation
