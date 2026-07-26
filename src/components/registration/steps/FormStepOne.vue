<script setup>
import { computed } from 'vue'
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
})

const shippingAddressLabel = computed(() =>
  props.hasMerchandiseSelected
    ? 'Shipping Address'
    : 'Shipping Address (Optional)',
)

const shippingAddressError = computed(() => {
  const shouldRequireAddress =
    props.hasMerchandiseSelected &&
    props.showValidation &&
    !attendee.value.shippingAddress.trim()

  return shouldRequireAddress
    ? 'Shipping address is required for merchandise orders'
    : ''
})
</script>

<template>
  <div class="space-y-8">
    <section aria-labelledby="ticket-heading">
      <h2 id="ticket-heading" class="text-subtitle1 text-neutral mb-4">
        Select Ticket Type
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
        Attendee Information
      </h2>

      <form class="grid gap-y-5 gap-x-6 grid-cols-2 max-desktop:grid-cols-1">
        <FormField
          v-model="attendee.fullName"
          label="Full Name"
          autocomplete="name"
          placeholder="John full name"
        />

        <FormField
          v-model="attendee.email"
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="John email address"
        />

        <FormField
          v-model="attendee.phone"
          label="Phone"
          type="tel"
          autocomplete="tel"
          placeholder="Enter your phone number"
        />

        <FormField
          v-model="attendee.company"
          label="Company"
          autocomplete="organization"
          placeholder="Enter your company name"
        />

        <FormField
          v-model="attendee.jobTitle"
          label="Job Title"
          autocomplete="organization-title"
          placeholder="Enter your job title"
          wide
        />

        <FormField
          v-model="attendee.shippingAddress"
          :label="shippingAddressLabel"
          :required="hasMerchandiseSelected"
          :error="shippingAddressError"
          autocomplete="shipping street-address"
          placeholder="Enter your shipping address"
          wide
        />
      </form>
    </section>
  </div>
</template>
