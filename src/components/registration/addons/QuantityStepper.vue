<script setup>
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

function decrease() {
  model.value = Math.max(model.value - 1, 0)
}

function increase() {
  model.value = Math.min(model.value + 1, props.max)
}
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <q-btn
      dense
      unelevated
      class="size-6 rounded-m bg-neutral-muted-rest text-neutral"
      icon="remove"
      :disable="model <= 0"
      @click="decrease"
    />
    <span class="min-w-5 text-center text-subtitle2 text-neutral">
      {{ model }}
    </span>
    <q-btn
      dense
      unelevated
      class="size-6 rounded-m bg-neutral-muted-rest text-neutral"
      icon="add"
      :disable="model >= max"
      @click="increase"
    />
  </div>
</template>
