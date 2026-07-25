<script setup>
import checkIconUrl from 'src/assets/icons/circle-check.svg'

defineProps({
  ticket: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
</script>

<template>
  <button
    type="button"
    class="ticket-card relative flex flex-col gap-3 text-left p-5 min-h-none tablet:min-h-[378px] rounded-m bg-surface-l1 text-neutral cursor-pointer"
    :class="{ 'ticket-card--selected bg-brand-subtle-rest': selected }"
    :aria-pressed="selected"
    @click="$emit('select')"
  >
    <span class="flex items-start justify-between gap-5 text-subtitle1">
      <span>{{ ticket.name }}</span>
      <span>{{ formatCurrency(ticket.price) }}</span>
    </span>

    <span class="block text-sm text-neutral-muted">
      {{ ticket.description }}
    </span>

    <span class="flex flex-col gap-3">
      <span
        v-for="perk in ticket.perks"
        :key="perk"
        class="flex items-center gap-2 text-neutral-muted"
      >
        <img class="block w-[14px] h-[14px]" :src="checkIconUrl" alt="" aria-hidden="true">
        <span class="text-sm">{{ perk }}</span>
      </span>
    </span>

    <span
      v-if="selected"
      class="inline-flex items-center self-start gap-1 px-[9px] py-[3px] rounded-full bg-success-bold-rest text-inverse text-xs-b"
    >
      <q-icon name="check" size="14px" aria-hidden="true" />
      Selected
    </span>
  </button>
</template>

<style scoped>
.ticket-card {
  --ticket-shadow:
    0 1px 3px 0 #0000000a,
    0 4px 16px 0 #00000014;

  appearance: none;
  border: 2px solid transparent;
  box-shadow:
    var(--ticket-shadow),
    0 0 0 1px var(--border-neutral-muted);
  transition: background 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
}

.ticket-card:hover,
.ticket-card:focus-visible {
  border-color: var(--border-brand-muted);
  box-shadow: var(--ticket-shadow);
  outline: none;
}

.ticket-card--selected,
.ticket-card--selected:hover,
.ticket-card--selected:focus-visible {
  border-color: var(--border-brand-emphasis);
  box-shadow: var(--ticket-shadow);
}
</style>
