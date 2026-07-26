<script setup>
import checkIconUrl from 'src/assets/icons/circle-check.svg'
import SelectableCardFrame from './shared/SelectableCardFrame.vue'
import { formatCurrency } from 'src/utils/currency.js'

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
</script>

<template>
  <SelectableCardFrame
    class="ticket-card relative flex flex-col gap-3 text-left p-5 min-h-none tablet:min-h-[292px] rounded-m bg-surface-l1 text-neutral cursor-pointer"
    :selected="selected"
    default-surface="bg-surface-l1"
    selected-surface="bg-brand-subtle-rest"
    padding-class="p-5"
    min-height-class="min-h-none tablet:min-h-[292px]"
    @press="$emit('select')"
  >
    <span class="flex items-start justify-between gap-5 text-subtitle1">
      <span>{{ ticket.name }}</span>
      <span>{{ formatCurrency(ticket.price, { maximumFractionDigits: 0 }) }}</span>
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
  </SelectableCardFrame>
</template>
