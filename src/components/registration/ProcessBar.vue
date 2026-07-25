<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <nav class="process-bar py-4 wrapper flex items-center flex-none w-full" aria-label="Registration progress">
    <ol class="flex list-none m-0 p-0 tablet:gap-x-4 gap-y-2 items-center w-full max-tablet:justify-between">
      <li
        v-for="(step, index) in steps"
        :key="step.number"
        class="process-step flex items-center gap-[10px] min-w-0"
        :class="[
          index < steps.length - 1 ? 'tablet:flex-1' : 'flex-none',
          step.number === currentStep ? 'text-neutral' : 'text-neutral-quiet',
        ]"
      >
        <span
          class="process-step__marker inline-flex flex-none items-center justify-center size-[32px] rounded-full text-sm-b"
          :class="step.number === currentStep
            ? 'bg-brand-emphasis-rest text-inverse'
            : 'bg-surface-l2 text-neutral-quiet'"
        >
          {{ step.number }}
        </span>
        <span
          class="process-step__label flex-none text-sm whitespace-nowrap"
          :class="step.number === currentStep ? 'text-neutral font-semibold max-mobile:flex-1' : 'text-neutral-quiet max-mobile:hidden'"
        >
          {{ step.label }}
        </span>
        <span
          v-if="index < steps.length - 1"
          class="process-step__line flex-auto h-0.5 mx-1 bg-[var(--divider-default)] max-tablet:hidden"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
