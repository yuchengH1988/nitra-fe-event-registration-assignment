<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  title: {
    type: String,
    required: true,
  },
  editLabel: {
    type: String,
    required: true,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit'])
const { t } = useI18n()
</script>

<template>
  <section
    class="rounded bg-surface-l1 p-4 border"
    :class="invalid ? 'border-2 border-danger-emphasis' : ' border-neutral-muted'"
  >
    <header class="mb-3 flex items-start justify-between gap-4">
      <h3 class="text-subtitle1" :class="invalid ? 'text-danger' : 'text-neutral'">
        {{ title }}
      </h3>
      <button
        type="button"
        class="text-sm-b text-brand hover:text-brand-emphasis-active underline"
        @click="$emit('edit')"
      >
        {{ t('actions.editStep', { step: editLabel }) }}
      </button>
    </header>
    <slot />
  </section>
</template>
