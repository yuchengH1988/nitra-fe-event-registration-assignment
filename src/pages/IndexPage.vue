<script setup>
import { reactive, ref } from 'vue'
import FormStepOne from 'src/components/registration/FormStepOne.vue'
import ProcessBar from 'src/components/registration/ProcessBar.vue'
import WizardFooter from 'src/components/registration/WizardFooter.vue'
import { event } from 'src/mocks/event.js'

const steps = [
  { number: 1, label: 'Attendee Info' },
  { number: 2, label: 'Sessions' },
  { number: 3, label: 'Add-ons' },
  { number: 4, label: 'Review' },
]

const selectedTicketId = ref('vip')

const attendee = reactive({
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  shippingAddress: '',
})
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0 divide-y divide-solid divide-[color:var(--divider-default)]">
    <ProcessBar :steps="steps" :current-step="1" />

    <main class="flex-1 min-h-0 overflow-y-auto">
      <div class="wrapper py-4 tablet:py-10">
        <FormStepOne
          v-model:attendee="attendee"
          v-model:selected-ticket-id="selectedTicketId"
          :ticket-types="event.ticketTypes"
        />
      </div>
    </main>

    <WizardFooter />
  </div>
</template>
