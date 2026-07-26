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
  invalidSteps: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select-step'])

function onSelectStep(stepNumber, currentStep) {
  if (stepNumber >= currentStep) return
  emit('select-step', stepNumber)
}
</script>

<template>
  <nav class="process-bar py-2 tablet:py-4 wrapper flex items-center flex-none w-full" aria-label="Registration progress">
    <ol class="flex list-none m-0 p-0 tablet:gap-x-4 gap-y-2 items-center w-full max-tablet:justify-between">
      <li
        v-for="(step, index) in steps"
        :key="step.number"
        class="process-step flex items-center gap-[10px] min-w-0"
        :class="[
          index < steps.length - 1 ? 'tablet:flex-1' : 'flex-none',
          step.number <= currentStep ? 'text-neutral' : 'text-neutral-quiet',
        ]"
      >
        <button
          type="button"
          class="process-step__button inline-flex items-center gap-[10px] min-w-0 appearance-none bg-transparent border-0 p-0 text-inherit"
          :class="step.number < currentStep ? 'cursor-pointer' : 'cursor-default'"
          :aria-current="step.number === currentStep ? 'step' : undefined"
          :aria-label="step.number < currentStep ? `Go to ${step.label}` : step.label"
          @click="onSelectStep(step.number, currentStep)"
        >
          <span
            class="process-step__marker inline-flex flex-none items-center justify-center size-[32px] rounded-full text-sm-b"
            :class="invalidSteps.includes(step.number)
              ? 'bg-danger-emphasis-rest text-inverse'
              : step.number <= currentStep
              ? 'bg-brand-emphasis-rest text-inverse'
              : 'bg-surface-l2 text-neutral-quiet'"
          >
            <q-icon v-if="invalidSteps.includes(step.number)" name="priority_high" size="20px" aria-hidden="true" />
            <q-icon v-else-if="step.number < currentStep" name="check" size="20px" aria-hidden="true" />
            <template v-else>
              {{ step.number }}
            </template>
          </span>
          <span
            class="process-step__label flex-none text-sm whitespace-nowrap"
            :class="step.number <= currentStep ? 'text-neutral font-semibold max-mobile:flex-1' : 'text-neutral-quiet max-mobile:hidden'"
          >
            {{ step.label }}
          </span>
        </button>
        <span
          v-if="index < steps.length - 1"
          class="process-step__line flex-auto h-0.5 mx-1 max-tablet:hidden"
          :class="[
            step.number < currentStep ? 'bg-brand-emphasis-rest' : 'bg-[var(--divider-default)]',
            invalidSteps.includes(step.number) && 'bg-surface-l2'
          ]"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
