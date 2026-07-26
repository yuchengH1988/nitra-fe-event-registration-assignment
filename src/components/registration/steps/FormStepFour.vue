<script setup>
import { computed } from 'vue'
import ReviewSection from '../common/ReviewSection.vue'
import { formatCurrency } from 'src/utils/currency.js'
import { formatReviewSessionTime } from 'src/utils/registration-data.js'

const props = defineProps({
  registration: {
    type: Object,
    required: true,
  },
  selectedTicket: {
    type: Object,
    default: null,
  },
  selectedSessions: {
    type: Array,
    required: true,
  },
  selectedWorkshops: {
    type: Array,
    required: true,
  },
  selectedMeals: {
    type: Array,
    required: true,
  },
  selectedMerchandise: {
    type: Array,
    required: true,
  },
  hasMerchandiseSelected: {
    type: Boolean,
    default: false,
  },
  orderLineItems: {
    type: Array,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  validationResult: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit-step'])

const attendeeRows = computed(() => {
  const rows = [
    ['Name', props.registration.attendee.fullName, 'fullName'],
    ['Email', props.registration.attendee.email, 'email'],
    ['Phone', props.registration.attendee.phone, 'phone'],
    ['Company', props.registration.attendee.company, 'company'],
    ['Job Title', props.registration.attendee.jobTitle, 'jobTitle'],
  ]

  const shippingAddress = props.registration.attendee.shippingAddress?.trim()
  if (shippingAddress || props.hasMerchandiseSelected) {
    rows.push(['Shipping Address', shippingAddress, 'shippingAddress'])
  }

  if (props.selectedTicket) {
    rows.push([
      'Ticket Type',
      `${props.selectedTicket.name} (${formatCurrency(props.selectedTicket.price)})`,
      'ticketTypeId',
    ])
  }

  return rows
})

const selectedAddons = computed(() => [
  ...props.selectedWorkshops.map((item) => [
    'Workshop',
    `${item.name} (${formatCurrency(item.price)})`,
  ]),
  ...props.selectedMeals.map((item) => [
    'Meal',
    `${item.name} (${formatCurrency(item.price)})`,
  ]),
  ...props.selectedMerchandise.map((item) => [
    'Merchandise',
    `${item.name} × ${item.quantity}${item.size ? ` (${item.size})` : ''} (${formatCurrency(item.price * item.quantity)})`,
  ]),
])

function getFieldError(field) {
  return props.validationResult.byStep[1]?.find((error) => error.field === field)?.message ?? ''
}

function getFieldErrorCode(field) {
  return props.validationResult.byStep[1]?.find((error) => error.field === field)?.code ?? ''
}

function getReviewFieldValue(value, field) {
  if (value) return value

  const code = getFieldErrorCode(field)

  if (code === 'REQUIRED_SHIPPING_ADDRESS') {
    return '— (required for merchandise)'
  }

  if (code.startsWith('REQUIRED_')) {
    return '— (required)'
  }

  return '-'
}

function getStepErrors(step) {
  return props.validationResult.byStep[step] ?? []
}
</script>

<template>
  <section class="space-y-4 tablet:space-y-6" aria-labelledby="review-heading">
    <div
      v-if="validationResult.all.length"
      class="rounded-m border border-danger-muted bg-danger-muted-rest p-4 text-danger space-y-2"
    >
      <p class="text-sm-b">
        Please fix the following errors before submitting
      </p>
      <ul class="text-sm space-y-2">
        <li v-for="error in validationResult.all" :key="`${error.code}-${error.field}-${error.relatedIds.join('-')}`">
          • Step {{ error.step }}: {{ error.message }}
        </li>
      </ul>
    </div>

    <h2 id="review-heading" class="text-h3 text-neutral">
      Review Your Registration
    </h2>

    <ReviewSection
      title="Attendee Information"
      edit-label="1"
      :invalid="getStepErrors(1).length > 0"
      @edit="emit('edit-step', 1)"
    >
      <dl class="space-y-2">
        <div
          v-for="[label, value, field] in attendeeRows"
          :key="field"
          class="grid grid-cols-[160px_minmax(0,1fr)] gap-4 text-sm max-mobile:grid-cols-1 max-mobile:gap-1"
        >
          <dt class="text-neutral-muted">{{ label }}</dt>
          <dd
            class="text-right max-mobile:text-left"
            :class="getFieldError(field) ? 'text-danger' : 'text-neutral'"
          >
            {{ getReviewFieldValue(value, field) }}
            <span v-if="value && getFieldError(field)" class="ml-2">
              — {{ getFieldError(field) }}
            </span>
          </dd>
        </div>
      </dl>
    </ReviewSection>

    <ReviewSection
      title="Selected Sessions"
      edit-label="2"
      :invalid="getStepErrors(2).length > 0"
      @edit="emit('edit-step', 2)"
    >
      <div v-if="selectedSessions.length" class="space-y-2">
        <div
          v-for="session in selectedSessions"
          :key="session.id"
          class="grid grid-cols-[160px_minmax(0,1fr)] gap-4  max-mobile:grid-cols-1 max-mobile:gap-1 text-sm"
        >
          <span class="text-neutral-muted ">{{ formatReviewSessionTime(session) }}</span>
          <span class="text-right text-neutral max-mobile:text-left">{{ session.title }}</span>
        </div>
      </div>
      <p v-else class="text-sm text-neutral-muted">
        No sessions selected.
      </p>
      <p v-for="error in getStepErrors(2)" :key="error.code" class="mt-2 text-sm text-danger">
        {{ error.message }}
      </p>
    </ReviewSection>

    <ReviewSection
      title="Add-ons"
      edit-label="3"
      :invalid="getStepErrors(3).length > 0"
      @edit="emit('edit-step', 3)"
    >
      <div v-if="selectedAddons.length" class="space-y-2">
        <div
          v-for="[label, value] in selectedAddons"
          :key="`${label}-${value}`"
          class="grid grid-cols-[160px_minmax(0,1fr)] gap-4  max-mobile:grid-cols-1 max-mobile:gap-1 text-sm"
        >
          <span class="text-neutral-muted">{{ label }}</span>
          <span class="text-right text-neutral max-mobile:text-left">{{ value }}</span>
        </div>
      </div>
      <p v-else class="text-sm text-neutral-muted">
        No add-ons selected.
      </p>
      <p v-for="error in getStepErrors(3)" :key="error.code" class="mt-2 text-sm text-danger">
        {{ error.message }}
      </p>
    </ReviewSection>

    <section class="rounded border border-neutral-muted bg-surface-l1 p-4">
      <h3 class="mb-3 text-subtitle2 text-neutral">
        Pricing Summary
      </h3>
      <div class="space-y-2">
        <div
          v-for="item in orderLineItems"
          :key="item.id"
          class="flex items-start justify-between gap-4"
          :class="item.category === 'discount'
            ? 'text-brand-emphasis text-sm-b'
            : 'text-sm text-neutral-muted'"
        >
          <span>
            {{ item.label }}<template v-if="item.quantity > 1"> × {{ item.quantity }}</template>
          </span>
          <span>
            {{ formatCurrency(item.total) }}
          </span>
        </div>
      </div>
      <div class="mt-4 border-t divider-default pt-4">
        <div class="flex items-center justify-between text-sm-b text-neutral">
          <span>Grand Total</span>
          <span>{{ formatCurrency(orderTotal) }}</span>
        </div>
      </div>
    </section>
  </section>
</template>
