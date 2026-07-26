<script setup>
import { computed } from 'vue'
import SelectableCardFrame from '../shared/SelectableCardFrame.vue'
import { formatCurrency } from 'src/utils/currency.js'
import {
  formatSessionTimeRange,
  getRemainingCapacity,
  isAtCapacity,
} from 'src/utils/registration-data.js'

const props = defineProps({
  workshop: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  unavailable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle'])

const full = computed(() => isAtCapacity(props.workshop))
const disabled = computed(() => !props.selected && (full.value || props.unavailable))
const remaining = computed(() => getRemainingCapacity(props.workshop))
</script>

<template>
  <SelectableCardFrame
    class="addon-card flex flex-col gap-2"
    :selected="selected"
    :disabled="disabled"
    default-surface="bg-surface-l0"
    selected-surface="bg-brand-muted-rest"
    padding-class="p-4"
    @press="$emit('toggle')"
  >
    <span class="flex items-start justify-between gap-4">
      <span class="text-subtitle2 text-neutral">{{ workshop.name }}</span>
      <span class="text-subtitle2 text-brand-emphasis">
        {{ formatCurrency(workshop.price, { maximumFractionDigits: 0 }) }}
      </span>
    </span>
    <span class="text-xs text-neutral-muted">{{ workshop.description }}</span>
    <span class="text-xs text-neutral-quiet">{{ formatSessionTimeRange(workshop) }}</span>
    <span class="text-xs" :class="full ? 'text-neutral' : 'text-brand-emphasis'">
      {{ full ? 'Sold Out' : `${remaining} spots remaining` }}
    </span>
  </SelectableCardFrame>
</template>
