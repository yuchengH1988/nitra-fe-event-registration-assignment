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
    class="ticket-card relative flex flex-col text-left min-h-[378px] p-[26px] rounded-[6px] bg-surface-l1 text-neutral border border-neutral-muted cursor-pointer"
    :class="{ 'ticket-card--selected bg-brand-subtle-rest border-brand-emphasis': selected }"
    :aria-pressed="selected"
    @click="$emit('select')"
  >
    <span class="flex items-start justify-between gap-5 mb-[14px]">
      <span class="text-h3 text-neutral">{{ ticket.name }}</span>
      <span class="text-h3 text-neutral">{{ formatCurrency(ticket.price) }}</span>
    </span>

    <span class="block text-lg text-neutral-muted mb-[18px]">
      {{ ticket.description }}
    </span>

    <span class="flex flex-col gap-[14px]">
      <span
        v-for="perk in ticket.perks"
        :key="perk"
        class="flex items-center gap-3 text-lg text-neutral-muted"
      >
        <img class="block w-[14px] h-[14px]" :src="checkIconUrl" alt="" aria-hidden="true">
        <span>{{ perk }}</span>
      </span>
    </span>

    <span
      v-if="selected"
      class="inline-flex items-center self-start gap-1 mt-[18px] px-3 py-1 rounded-full bg-success-bold-rest text-inverse text-subtitle2 font-bold"
    >
      <q-icon name="check" size="14px" aria-hidden="true" />
      Selected
    </span>
  </button>
</template>

<style scoped>
.ticket-card {
  appearance: none;
  box-shadow: 0 1px 3px rgba(46, 53, 56, 0.08);
  transition: background 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
}

.ticket-card:hover {
  border-color: var(--border-brand-muted);
  box-shadow: 0 3px 12px rgba(46, 53, 56, 0.12);
}

.ticket-card:focus-visible {
  outline: 3px solid var(--border-brand-opacity);
  outline-offset: 2px;
}

.ticket-card--selected {
  border-width: 2px;
  box-shadow: 0 0 0 1px var(--border-brand-emphasis);
  padding: 25px;
}

@media (max-width: 1023px) {
  .ticket-card {
    min-height: 0;
  }
}
</style>
