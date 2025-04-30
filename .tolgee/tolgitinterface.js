import { flatten } from 'flat'
import * as fs from 'fs'
import stableStringify from 'json-stable-stringify'

/**
 * Pull function receives an object of localized translations
 * and update local files
 *
 * { [i18code]: { [key]: value } }.
 *
 */
export const pull = translations => {
  for (let code in translations) {
    fs.writeFileSync(
      `../src/i18n/locales/${code}.json`,
      stableStringify(translations[code] || {}, { space: 4 })
    )
  }
}

export const listI18nCodes = () => {
  const langs = fs.readdirSync('../src/i18n/locales/')
  const codes = []
  for (let lang of langs) {
    const code = lang.slice(0, -5)
    codes.push(code)
  }
  return codes
}

/**
 * Push function reads the repository and creates localized translations
 * @return { [i18ncode]: { [key]: value }}
 */
export const push = () => {
  const translationsByCode = {}
  const tags = {}

  const codes = listI18nCodes()

  for (let code of codes) {
    const assets = JSON.parse(
      fs.readFileSync(`../src/i18n/locales/${code}.json`)
    )
    translationsByCode[code] = flatten(assets)
  }
  console.log('translationsByCode', translationsByCode)
  return { translationsByCode, tags }
}
