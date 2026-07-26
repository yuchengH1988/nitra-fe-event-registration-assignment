<script setup>
import { formatCurrency } from 'src/utils/currency.js'

defineProps({
  lineItems: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <aside class="rounded-m bg-surface-l1 border border-neutral-muted p-4 tablet:p-6 space-y-4">
    <h3 class="text-subtitle1 text-neutral">
      Order Summary
    </h3>
    <div
      v-for="item in lineItems"
      :key="item.id"
      class="flex items-start justify-between gap-3"
      :class="item.category === 'discount'
        ? 'text-brand-emphasis text-sm-b'
        : 'text-sm text-neutral-muted'"
    >
      <span class="min-w-0 flex-1 break-words">
        {{ item.label }}<template v-if="item.quantity > 1"> × {{ item.quantity }}</template>
      </span>
      <span class="flex-none whitespace-nowrap">
        {{ formatCurrency(item.total) }}
      </span>
    </div>

    <div class="border-t divider-default"></div>
    <div class="flex items-center justify-between text-sm-b">
      <span>Total</span>
      <span>{{ formatCurrency(total) }}</span>
    </div>
  </aside> 
</template>
