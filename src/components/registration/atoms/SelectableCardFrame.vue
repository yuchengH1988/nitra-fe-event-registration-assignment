<script setup>
defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultSurface: {
    type: String,
    default: 'bg-surface-l0',
  },
  selectedSurface: {
    type: String,
    default: 'bg-brand-muted-rest',
  },
  paddingClass: {
    type: String,
    default: 'p-4',
  },
  minHeightClass: {
    type: String,
    default: '',
  },
  interactive: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['press'])
</script>

<template>
  <component
    :is="interactive ? 'button' : 'div'"
    :type="interactive ? 'button' : undefined"
    class="selectable-card rounded text-left transition-colors"
    :class="[
      paddingClass,
      minHeightClass,
      selected ? `selectable-card--selected ${selectedSurface}` : defaultSurface,
      disabled ? 'selectable-card--disabled' : 'cursor-pointer',
    ]"
    :disabled="interactive ? disabled : undefined"
    :aria-pressed="selected"
    @click="interactive && $emit('press')"
  >
    <slot />
  </component>
</template>

<style scoped>
.selectable-card {
  appearance: none;
  border: 2px solid transparent;
  box-shadow:
    0 1px 3px 0 #0000000a,
    0 4px 16px 0 #00000014,
    0 0 0 1px var(--border-neutral-muted);
}

.selectable-card:hover:not(:disabled),
.selectable-card:focus-visible:not(:disabled) {
  border-color: var(--border-brand-muted);
  outline: none;
}

.selectable-card--selected,
.selectable-card--selected:hover:not(:disabled),
.selectable-card--selected:focus-visible:not(:disabled) {
  border-color: var(--border-brand-emphasis);
  box-shadow:
    0 1px 3px 0 #0000000a,
    0 4px 16px 0 #00000014;
}

.selectable-card--disabled {
  cursor: not-allowed;
  opacity: 1 !important;
}
</style>
