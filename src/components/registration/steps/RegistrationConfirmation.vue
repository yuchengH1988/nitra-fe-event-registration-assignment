<script setup>
import { useRegistrationCopy } from 'src/composables/useRegistrationCopy.js'

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
  ticketType: {
    type: Object,
    default: null,
  },
})

defineEmits(['back-home'])
const { t, ticketName } = useRegistrationCopy()
</script>

<template>
  <section class="flex flex-1 items-center justify-center px-4 text-center">
    <div class="max-w-[520px] space-y-4 flex flex-col items-center">
      <div class="flex size-20 items-center justify-center rounded-full bg-success-emphasis-rest text-inverse">
        <q-icon name="check" size="60px" aria-hidden="true" />
      </div>
      <h2 class="text-h2 text-success">
        {{ t('headings.registrationComplete') }}
      </h2>
      <p class="text-lg text-neutral">
        {{ t('review.confirmation', { number: confirmationNumber }) }}
      </p>
      <p class="mx-auto text-sm text-neutral-muted">
        {{ t('review.confirmationBody', {
          name: attendeeName || t('review.attendeeFallback'),
          ticket: ticketType ? ticketName(ticketType) : t('review.ticketFallback'),
        }) }}
        <br>{{ t('review.confirmationEmail', { email: attendeeEmail || t('review.emailFallback') }) }}
      </p>
      <q-btn
        unelevated
        no-caps
        class="rounded bg-accent-emphasis-rest px-4 py-2 text-subtitle2 text-inverse"
        :label="t('actions.backHome')"
        @click="$emit('back-home')"
      />
    </div>
  </section>
</template>
