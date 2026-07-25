<script setup>
const model = defineModel({
  type: String,
  default: '',
})

defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  autocomplete: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  wide: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <label
    class="field flex flex-col gap-[9px] min-w-0 text-lg font-medium"
    :class="[
      wide ? 'field--wide' : '',
      error ? 'text-danger' : 'text-neutral',
    ]"
  >
    <span>
      {{ label }}<template v-if="required"> *</template>
    </span>
    <input
      v-model="model"
      class="field__input w-full min-w-0 h-[58px] px-4 rounded-[6px] bg-surface-l0 text-neutral text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] font-regular border border-neutral-muted"
      :class="{ 'field__input--error': error }"
      :type="type"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${label.replaceAll(' ', '-').toLowerCase()}-error` : undefined"
    >
    <span
      v-if="error"
      :id="`${label.replaceAll(' ', '-').toLowerCase()}-error`"
      class="text-lg font-regular text-danger"
    >
      {{ error }}
    </span>
  </label>
</template>

<style scoped>
.field--wide {
  grid-column: 1 / -1;
}

.field__input {
  transition: border-color 140ms ease, box-shadow 140ms ease;
}

.field__input::placeholder {
  color: var(--text-neutral-quiet);
  opacity: 1;
}

.field__input:focus {
  border-color: var(--border-brand-emphasis);
  box-shadow: 0 0 0 3px var(--border-brand-opacity);
  outline: none;
}

.field__input--error {
  border-color: var(--border-danger-emphasis);
}

.field__input--error:focus {
  border-color: var(--border-danger-emphasis);
  box-shadow: 0 0 0 3px var(--border-danger-opacity);
}

@media (max-width: 640px) {
  .field__input {
    font-size: var(--font-size-h4);
    line-height: var(--line-height-h4);
  }
}
</style>
