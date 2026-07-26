<script setup>
import { computed } from 'vue'
import SelectableCardFrame from '../atoms/SelectableCardFrame.vue'
import { useRegistrationCopy } from 'src/composables/useRegistrationCopy.js'
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
  unavailableReason: {
    type: String,
    default: '',
  },
})

defineEmits(['toggle'])
const {
  t,
  locale,
  addonName,
  addonDescription,
} = useRegistrationCopy()

const full = computed(() => isAtCapacity(props.workshop))
const disabled = computed(() => !props.selected && (full.value || props.unavailable))
const remaining = computed(() => getRemainingCapacity(props.workshop))
</script>

<template>
  <SelectableCardFrame
    class="addon-card flex flex-col gap-2 w-full"
    :class="[
      disabled ? 'addon-card--disabled' : '',
      full ? 'addon-card--full' : '',
    ]"
    :selected="selected"
    :disabled="disabled"
    default-surface="bg-surface-l0"
    selected-surface="bg-brand-muted-rest"
    padding-class="p-4"
    @press="$emit('toggle')"
  >
    <span class="flex items-start justify-between gap-4">
      <span class="addon-card__title text-subtitle1">{{ addonName(workshop) }}</span>
      <span class="addon-card__price text-subtitle1">
        {{ formatCurrency(workshop.price, { maximumFractionDigits: 0, locale }) }}
      </span>
    </span>
    <span class="addon-card__description text-sm">{{ addonDescription(workshop) }}</span>
    <span class="addon-card__time text-xs">{{ formatSessionTimeRange(workshop, locale) }}</span>
    <span class="addon-card__availability text-xs">
      {{ full ? t('common.soldOut') : t('common.spotsRemaining', { count: remaining }) }}
    </span>
    <span
      v-if="unavailableReason && !full"
      class="addon-card__reason text-xs-b text-danger-emphasis"
    >
      {{ unavailableReason }}
    </span>
  </SelectableCardFrame>
</template>

<style scoped>
.addon-card {
  --addon-availability-text: var(--text-neutral-quiet);
  --addon-description-text: var(--text-neutral-muted);
  --addon-price-text: var(--text-brand-emphasis);
  --addon-time-text: var(--text-neutral-quiet);
  --addon-title-text: var(--text-neutral);
}

.addon-card--disabled {
  --addon-availability-text: var(--text-warning-default);
  --addon-description-text: var(--text-neutral-disabled);
  --addon-price-text: var(--text-neutral-disabled);
  --addon-time-text: var(--text-neutral-disabled);
  --addon-title-text: var(--text-neutral-disabled);
}

.addon-card--full {
  --addon-availability-text: var(--text-neutral);
}

.addon-card__title {
  color: var(--addon-title-text);
}

.addon-card__price {
  color: var(--addon-price-text);
}

.addon-card__description {
  color: var(--addon-description-text);
}

.addon-card__time {
  color: var(--addon-time-text);
}

.addon-card__availability {
  color: var(--addon-availability-text);
}
</style>
