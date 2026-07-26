<script setup>
defineProps({
  primaryLabel: {
    type: String,
    default: 'Next: Session Selection',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['back', 'next'])
</script>

<template>
  <footer class="wizard-footer flex-none py-4 bg-surface-l0">
    <div class="wrapper flex items-center" :class="showBack ? 'justify-between' : 'justify-end'">
      <q-btn
        v-if="showBack"
        unelevated
        no-caps
        class="back-button px-4 py-2.5 rounded text-subtitle2 text-neutral-muted bg-neutral-muted-rest"
        label="Back"
        @click="$emit('back')"
      />
      <q-btn
        unelevated
        no-caps
        class="next-button px-4 py-2.5 rounded text-subtitle2 text-inverse bg-accent-emphasis-rest"
        :label="primaryLabel"
        @click="$emit('next')"
      />
    </div>
  </footer>
</template>

<style scoped>
.next-button:hover {
  background: var(--bg-accent-emphasis-hover);
}

.back-button:hover {
  background: var(--bg-neutral-muted-hover);
}
</style>
