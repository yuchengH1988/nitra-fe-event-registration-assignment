<script setup>
import emblemUrl from 'src/assets/icons/Emblems.svg'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { SUPPORT_LOCALES } from 'src/i18n/index.js'

const { locale, t } = useI18n()
const router = useRouter()

defineProps({
  title: {
    type: String,
    required: true,
  },
})

function switchLocale(targetLocale) {
  router.push({ name: targetLocale === 'zh-TW' ? 'registration-zh' : 'registration-en' })
}
</script>

<template>
  <header class="flex-none border-b border-solid border-[color:var(--divider-default)]">
    <div class="flex items-center justify-between gap-4 py-2 tablet:py-4 mx-auto max-w-[1800px] px-12 max-desktop:px-4">
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex items-center justify-center size-10 max-desktop:size-8 rounded bg-brand-emphasis-rest"
          aria-hidden="true"
        >
          <img class="block h-auto w-7 max-desktop:w-5" :src="emblemUrl" alt="">
        </div>
        <h4 class="text-h4 truncate">
          {{ title }}
        </h4>
      </div>
      <div class="inline-flex flex-none rounded bg-surface-l2 p-1" :aria-label="t('locale.switcherLabel')">
        <button
          v-for="targetLocale in SUPPORT_LOCALES"
          :key="targetLocale"
          type="button"
          class="rounded-m px-3 py-1.5 text-sm-b transition-colors"
          :class="targetLocale === locale
            ? 'bg-brand-emphasis-rest text-inverse'
            : 'text-neutral-muted hover:bg-neutral-muted-hover'"
          @click="switchLocale(targetLocale)"
        >
          {{ targetLocale === 'en' ? t('locale.english') : t('locale.chinese') }}
        </button>
      </div>
    </div>
  </header>
</template>
