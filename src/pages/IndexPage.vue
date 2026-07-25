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
      <div class="registration-content mx-auto max-w-[1580px] pt-14 pb-12">
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

<style scoped>
@media (max-width: 1700px) {
  .registration-content {
    margin-left: 10vw;
    margin-right: 10vw;
  }
}

@media (max-width: 1023px) {
  .registration-content {
    margin-left: 24px;
    margin-right: 24px;
    padding-top: 32px;
  }
}

@media (max-width: 640px) {
  .registration-content {
    margin-left: 16px;
    margin-right: 16px;
  }
}
</style>
