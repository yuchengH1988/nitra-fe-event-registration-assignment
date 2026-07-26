<script setup>
import { useI18n } from 'vue-i18n'
import minusIconUrl from 'src/assets/icons/minus.svg'
import plusIconUrl from 'src/assets/icons/plus.svg'

const model = defineModel({
  type: Number,
  required: true,
})

const props = defineProps({
  max: {
    type: Number,
    required: true,
  },
})

const { t } = useI18n()

function decrease() {
  model.value = Math.max(model.value - 1, 0)
}

function increase() {
  model.value = Math.min(model.value + 1, props.max)
}
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <button
      type="button"
      class="inline-flex size-7 items-center justify-center rounded-m bg-neutral-muted-rest"
      :disabled="model <= 0"
      :aria-label="t('actions.decreaseQuantity')"
      @click="decrease"
    >
      <img class="block w-3 h-0.5" :src="minusIconUrl" alt="" aria-hidden="true">
    </button>
    <span class="min-w-6 text-center text-subtitle2 text-neutral">
      {{ model }}
    </span>
    <button
      type="button"
      class="inline-flex size-7 items-center justify-center rounded-m bg-neutral-muted-rest"
      :aria-label="t('actions.increaseQuantity')"
      :disabled="model >= max"
      @click="increase"
    >
      <img class="block size-3" :src="plusIconUrl" alt="" aria-hidden="true">
    </button>
  </div>
</template>
