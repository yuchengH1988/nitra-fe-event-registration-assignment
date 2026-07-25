<script setup>
defineProps({
  primaryLabel: {
    type: String,
    default: 'Next: Session Selection',
  },
})

defineEmits(['next'])
</script>

<template>
  <footer class="wizard-footer flex-none py-4 bg-surface-l0">
    <div class="wrapper flex items-center justify-end">
      <q-btn
        unelevated
        no-caps
        class="next-button px-4 py-2.5 rounded-default text-subtitle2 text-inverse bg-accent-emphasis-rest"
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
</style>
