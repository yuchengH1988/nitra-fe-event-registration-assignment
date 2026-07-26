<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FormField from '../atoms/FormField.vue'
import TicketOptionCard from '../common/TicketOptionCard.vue'

const attendee = defineModel('attendee', {
  type: Object,
  required: true,
})

const selectedTicketId = defineModel('selectedTicketId', {
  type: String,
  required: true,
})

const props = defineProps({
  ticketTypes: {
    type: Array,
    required: true,
  },
  hasMerchandiseSelected: {
    type: Boolean,
    default: false,
  },
  showValidation: {
    type: Boolean,
    default: false,
  },
  stepErrors: {
    type: Array,
    default: () => [],
  },
})

const { t } = useI18n()

const shippingAddressLabel = computed(() =>
  props.hasMerchandiseSelected
    ? t('form.shippingAddress')
    : t('form.shippingAddressOptional'),
)

function fieldError(field) {
  if (!props.showValidation) return ''

  const error = props.stepErrors.find((item) => item.field === field)

  return error ? t(`validation.${error.code}`) : ''
}
</script>

<template>
  <div class="space-y-8">
    <section aria-labelledby="ticket-heading">
      <h2 id="ticket-heading" class="text-subtitle1 text-neutral mb-4">
        {{ t('headings.selectTicketType') }}
      </h2>

      <div class="grid gap-4 grid-cols-3 max-desktop:grid-cols-1">
        <TicketOptionCard
          v-for="ticket in ticketTypes"
          :key="ticket.id"
          :ticket="ticket"
          :selected="selectedTicketId === ticket.id"
          @select="selectedTicketId = ticket.id"
        />
      </div>
    </section>

    <section aria-labelledby="attendee-heading text-neutral">
      <h2 id="attendee-heading" class="text-h3 mb-8">
        {{ t('headings.attendeeInformation') }}
      </h2>

      <form class="grid gap-y-5 gap-x-6 grid-cols-2 max-desktop:grid-cols-1">
        <FormField
          v-model="attendee.fullName"
          :label="t('form.fullName')"
          autocomplete="name"
          :placeholder="t('form.placeholders.fullName')"
          :error="fieldError('fullName')"
        />

        <FormField
          v-model="attendee.email"
          :label="t('form.email')"
          type="email"
          autocomplete="email"
          :placeholder="t('form.placeholders.email')"
          :error="fieldError('email')"
        />

        <FormField
          v-model="attendee.phone"
          :label="t('form.phone')"
          type="tel"
          autocomplete="tel"
          :placeholder="t('form.placeholders.phone')"
          :error="fieldError('phone')"
        />

        <FormField
          v-model="attendee.company"
          :label="t('form.company')"
          autocomplete="organization"
          :placeholder="t('form.placeholders.company')"
          :error="fieldError('company')"
        />

        <FormField
          v-model="attendee.jobTitle"
          :label="t('form.jobTitle')"
          autocomplete="organization-title"
          :placeholder="t('form.placeholders.jobTitle')"
          :error="fieldError('jobTitle')"
          wide
        />

        <FormField
          v-model="attendee.shippingAddress"
          :label="shippingAddressLabel"
          :required="hasMerchandiseSelected"
          :error="fieldError('shippingAddress')"
          autocomplete="shipping street-address"
          :placeholder="t('form.placeholders.shippingAddress')"
          wide
        />
      </form>
    </section>
  </div>
</template>
