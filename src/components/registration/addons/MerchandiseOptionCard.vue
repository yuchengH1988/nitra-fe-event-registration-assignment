<script setup>
import { computed } from 'vue'
import QuantityStepper from './QuantityStepper.vue'
import SelectableCardFrame from '../shared/SelectableCardFrame.vue'
import { formatCurrency } from 'src/utils/currency.js'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Object,
    default: () => ({ quantity: 0, size: null }),
  },
})

const emit = defineEmits(['update:modelValue'])

const selected = computed(() => Number(props.modelValue.quantity ?? 0) > 0)

const quantity = computed({
  get: () => Number(props.modelValue.quantity ?? 0),
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      quantity: value,
      size: props.modelValue.size ?? props.item.sizes?.[0] ?? null,
    })
  },
})

const size = computed({
  get: () => props.modelValue.size ?? '',
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      size: value || null,
    })
  },
})
</script>

<template>
  <SelectableCardFrame
    class="addon-card flex flex-col gap-3"
    :selected="selected"
    :interactive="false"
    default-surface="bg-surface-l0"
    selected-surface="bg-brand-muted-rest"
    padding-class="p-4"
  >
    <span class="flex items-start justify-between gap-4">
      <span class="text-subtitle2 text-neutral">{{ item.name }}</span>
      <span class="text-subtitle2 text-neutral">
        {{ formatCurrency(item.price, { maximumFractionDigits: 0 }) }}
      </span>
    </span>

    <span class="text-xs text-neutral-muted">{{ item.description }}</span>

    <span class="flex flex-wrap items-center gap-4 text-xs text-neutral-muted">
      <label v-if="item.sizes" class="inline-flex items-center gap-2">
        <span>Size:</span>
        <select v-model="size" class="rounded-m border border-neutral-muted bg-surface-l0 px-2 py-1 text-xs">
          <option value="">
            Select
          </option>
          <option v-for="option in item.sizes" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>

      <span class="inline-flex items-center gap-2">
        <span>Qty:</span>
        <QuantityStepper v-model="quantity" :max="item.maxQuantity" />
        <span class="text-xs text-neutral-quiet">max {{ item.maxQuantity }}</span>
      </span>
    </span>

    <span v-if="selected" class="text-xs-b text-success">
      ✓ Added to order
    </span>
  </SelectableCardFrame>
</template>
