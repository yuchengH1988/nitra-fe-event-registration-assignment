<script setup>
import SelectableCardFrame from '../shared/SelectableCardFrame.vue'
import { formatCurrency } from 'src/utils/currency.js'

defineProps({
  meal: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle'])
</script>

<template>
  <SelectableCardFrame
    class="addon-card flex flex-col gap-2 w-full"
    :selected="selected"
    default-surface="bg-surface-l0"
    selected-surface="bg-brand-muted-rest"
    padding-class="p-4"
    @press="$emit('toggle')"
  >
    <span class="flex items-start justify-between gap-4">
      <span class="text-subtitle1 text-neutral">{{ meal.name }}</span>
      <span class="text-subtitle1 text-brand-emphasis">
        {{ formatCurrency(meal.price, { maximumFractionDigits: 0 }) }}
      </span>
    </span>
    <span class="text-sm text-neutral-muted">{{ meal.description }}</span>
  </SelectableCardFrame>
</template>
