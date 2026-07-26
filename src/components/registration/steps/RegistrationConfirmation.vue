<script setup>
defineProps({
  confirmationNumber: {
    type: String,
    required: true,
  },
  attendeeName: {
    type: String,
    default: '',
  },
  attendeeEmail: {
    type: String,
    default: '',
  },
})

defineEmits(['back-home'])
</script>

<template>
  <section class="flex flex-1 items-center justify-center px-4 text-center">
    <div class="max-w-[520px]">
      <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success-emphasis-rest text-inverse">
        <q-icon name="check" size="36px" aria-hidden="true" />
      </div>
      <h2 class="text-h3 text-success">
        Registration Complete!
      </h2>
      <p class="mt-2 text-sm-b text-neutral">
        Confirmation #{{ confirmationNumber }}
      </p>
      <p class="mx-auto mt-4 max-w-[420px] text-sm text-neutral-muted">
        Thank you, {{ attendeeName || 'attendee' }}. Your registration is confirmed.
        You will receive a confirmation email at {{ attendeeEmail || 'your email address' }}.
      </p>
      <q-btn
        unelevated
        no-caps
        class="mt-5 rounded bg-accent-emphasis-rest px-4 py-2 text-subtitle2 text-inverse"
        label="Back to Home"
        @click="$emit('back-home')"
      />
    </div>
  </section>
</template>
