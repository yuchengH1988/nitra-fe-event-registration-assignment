<script setup>
import { useI18n } from 'vue-i18n'
import { formatSessionDateTab } from 'src/utils/registration-data.js'

defineProps({
  groups: {
    type: Array,
    required: true,
  },
  activeDate: {
    type: String,
    required: true,
  },
})

defineEmits(['select'])
const { locale } = useI18n()
</script>

<template>
  <div class="rounded bg-surface-l2 inline-flex gap-1 p-1" role="tablist">
    <button
      v-for="group in groups"
      :key="group.date"
      type="button"
      class="rounded-lg px-5 py-2 text-[13px] font-semibold transition-colors"
      :class="group.date === activeDate
        ? 'bg-brand-emphasis-rest text-inverse'
        : 'text-neutral-muted hover:bg-neutral-muted-hover'"
      :aria-selected="group.date === activeDate"
      role="tab"
      @click="$emit('select', group.date)"
    >
      {{ formatSessionDateTab(group.date, locale) }}
    </button>
  </div>
</template>
