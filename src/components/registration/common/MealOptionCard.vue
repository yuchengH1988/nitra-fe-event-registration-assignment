<script setup>
import SelectableCardFrame from '../atoms/SelectableCardFrame.vue'
import { useRegistrationCopy } from 'src/composables/useRegistrationCopy.js'
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
  included: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle'])
const { t, locale, addonName, addonDescription } = useRegistrationCopy()
</script>

<template>
  <SelectableCardFrame
    class="addon-card flex flex-col gap-2 w-full"
    :selected="selected"
    :disabled="included"
    default-surface="bg-surface-l0"
    selected-surface="bg-brand-muted-rest"
    padding-class="p-4"
    @press="$emit('toggle')"
  >
    <span class="flex items-start justify-between gap-4">
      <span class="text-subtitle1 text-neutral">{{ addonName(meal) }}</span>
      <span class="text-subtitle1 text-brand-emphasis">
        {{ included ? t('common.includedWithVipTicket') : formatCurrency(meal.price, { maximumFractionDigits: 0, locale }) }}
      </span>
    </span>
    <span class="text-sm text-neutral-muted">{{ addonDescription(meal) }}</span>
    <span v-if="included" class="text-xs-b text-success">
      ✓ {{ t('common.includedInVipTicket') }}
    </span>
  </SelectableCardFrame>
</template>
