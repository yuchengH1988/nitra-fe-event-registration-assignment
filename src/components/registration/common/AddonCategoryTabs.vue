<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
})

defineEmits(['select'])
const { t } = useI18n()
</script>

<template>
  <div class="inline-flex rounded bg-surface-l2 p-1 gap-1" role="tablist" :aria-label="t('headings.selectAddons')">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="rounded-lg px-4 py-2 text-sm-b transition-colors"
      :class="tab.id === activeTab
        ? 'bg-brand-emphasis-rest text-inverse'
        : 'text-neutral-muted hover:bg-neutral-muted-hover'"
      :aria-selected="tab.id === activeTab"
      role="tab"
      @click="$emit('select', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
