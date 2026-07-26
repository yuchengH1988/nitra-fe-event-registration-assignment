import { createI18n } from 'vue-i18n'
import { messages } from './messages.js'

export const SUPPORT_LOCALES = ['en', 'zh-TW']
const FALLBACK_LOCALE = 'en'
const STORAGE_KEY = 'nitra-registration-locale'

function getInitialLocale() {
  return FALLBACK_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages,
})

export function setLocale(locale) {
  if (!SUPPORT_LOCALES.includes(locale)) return

  i18n.global.locale.value = locale

  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale
}

setLocale(i18n.global.locale.value)
