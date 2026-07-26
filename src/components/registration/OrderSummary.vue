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
  <aside class="rounded bg-surface-l1 border border-neutral-muted p-6">
    <h3 class="text-subtitle1 text-neutral mb-4">
      Order Summary
    </h3>

    <div class="space-y-3">
      <div
        v-for="item in lineItems"
        :key="item.id"
        class="flex items-start justify-between gap-4 text-xs"
      >
        <span class="text-neutral-muted">
          {{ item.label }}<template v-if="item.quantity > 1"> × {{ item.quantity }}</template>
        </span>
        <span :class="item.total < 0 ? 'text-brand-emphasis' : 'text-neutral'">
          {{ formatCurrency(item.total) }}
        </span>
      </div>
    </div>

    <div class="mt-5 border-t divider-default pt-5">
      <div class="flex items-center justify-between gap-4 text-xs-b">
        <span>Total</span>
        <span>{{ formatCurrency(total) }}</span>
      </div>
    </div>
  </aside>
</template>
