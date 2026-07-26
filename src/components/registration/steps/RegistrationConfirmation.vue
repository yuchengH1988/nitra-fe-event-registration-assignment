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
  ticketTypeName: {
    type: String,
    default: '',
  },
})

defineEmits(['back-home'])
</script>

<template>
  <section class="flex flex-1 items-center justify-center px-4 text-center">
    <div class="max-w-[520px] space-y-4 flex flex-col items-center">
      <div class="flex size-20 items-center justify-center rounded-full bg-success-emphasis-rest text-inverse">
        <q-icon name="check" size="60px" aria-hidden="true" />
      </div>
      <h2 class="text-h2 text-success">
        Registration Complete!
      </h2>
      <p class="text-lg text-neutral">
        Confirmation #{{ confirmationNumber }}
      </p>
      <p class="mx-auto text-sm text-neutral-muted">
        Thank you, {{ attendeeName || 'attendee' }}! Your {{ ticketTypeName || 'ticket' }} registration is confirmed.
        <br/>You will receive a confirmation email at {{ attendeeEmail || 'your email address' }}.
      </p>
      <q-btn
        unelevated
        no-caps
        class="rounded bg-accent-emphasis-rest px-4 py-2 text-subtitle2 text-inverse"
        label="Back to Home"
        @click="$emit('back-home')"
      />
    </div>
  </section>
</template>
