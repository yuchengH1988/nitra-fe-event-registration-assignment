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
    class="field flex flex-col gap-[6px] min-w-0"
    :class="[
      wide ? 'field--wide' : '',
      error ? 'text-danger' : 'text-neutral',
    ]"
  >
    <span class="text-sm-b">
      {{ label }}<template v-if="required"> *</template>
    </span>
    <input
      v-model="model"
      class="field__input w-full min-w-0 px-3 py-2.5 rounded-m bg-surface-l0 text-lg max-mobile:text-h4 border border-neutral-muted"
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
      class="text-xs text-danger"
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
  outline: none;
}

.field__input--error {
  border-color: var(--border-danger-emphasis);
}

.field__input--error:focus {
  border-color: var(--border-danger-emphasis);
}

</style>
