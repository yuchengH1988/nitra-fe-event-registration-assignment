<script setup>
import { computed } from 'vue'
import downTriangleUrl from 'src/assets/icons/down-triangle.svg'
import QuantityStepper from '../atoms/QuantityStepper.vue'
import SelectableCardFrame from '../atoms/SelectableCardFrame.vue'
import { useRegistrationCopy } from 'src/composables/useRegistrationCopy.js'
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
const { t, locale, addonName, addonDescription } = useRegistrationCopy()

const defaultSize = (sizes) => {
  if (!sizes?.length) return null
  return sizes.includes('M') ? 'M' : sizes[0]
}

const selected = computed(() => Number(props.modelValue.quantity ?? 0) > 0)

const quantity = computed({
  get: () => Number(props.modelValue.quantity ?? 0),
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      quantity: value,
      size: props.modelValue.size ?? defaultSize(props.item.sizes),
    })
  },
})

const size = computed({
  get: () => props.modelValue.size ?? defaultSize(props.item.sizes) ?? '',
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
    <span class="flex items-start justify-between gap-4 text-subtitle1 text-neutral">
      <span>{{ addonName(item) }}</span>
      <span>
        {{ formatCurrency(item.price, { maximumFractionDigits: 0, locale }) }}
      </span>
    </span>

    <span class="text-sm text-neutral-muted">{{ addonDescription(item) }}</span>
    <span class="flex flex-wrap items-center gap-4 text-neutral-muted text-sm-b">
      <label v-if="item.sizes" class="inline-flex items-center gap-2">
        <span>{{ t('common.size') }}</span>
        <span class="relative inline-flex items-center">
          <select
            v-model="size"
            class="appearance-none rounded-m border border-neutral-muted bg-surface-l0 pl-3 pr-5.5 py-1.5"
          >
            <option v-for="option in item.sizes" :key="option" :value="option" class="text-center">
              {{ option }}
            </option>
          </select>
          <img
            class="pointer-events-none absolute right-3 top-1/2 h-auto w-1 -translate-y-1/2"
            :src="downTriangleUrl"
            alt=""
            aria-hidden="true"
          >
        </span>
      </label>

      <span class="inline-flex items-center gap-2">
        <span>{{ t('common.quantity') }}</span>
        <QuantityStepper v-model="quantity" :max="item.maxQuantity" />
        <span class="text-ss text-neutral-quiet">{{ t('common.max', { count: item.maxQuantity }) }}</span>
      </span>
    </span>

    <span v-if="selected" class="text-xs-b text-success">
      ✓ {{ t('common.addedToOrder') }}
    </span>
  </SelectableCardFrame>
</template>
