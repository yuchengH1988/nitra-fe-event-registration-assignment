<script setup>
import FormStepOne from 'src/components/registration/steps/FormStepOne.vue'
import FormStepFour from 'src/components/registration/steps/FormStepFour.vue'
import FormStepThree from 'src/components/registration/steps/FormStepThree.vue'
import FormStepTwo from 'src/components/registration/steps/FormStepTwo.vue'
import RegistrationConfirmation from 'src/components/registration/steps/RegistrationConfirmation.vue'
import ProcessBar from 'src/components/registration/layout/ProcessBar.vue'
import WizardFooter from 'src/components/registration/layout/WizardFooter.vue'
import { useRegistrationWizard } from 'src/composables/useRegistrationWizard.js'
import { useI18n } from 'vue-i18n'

const wizard = useRegistrationWizard()
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0 divide-y divide-solid divide-[color:var(--divider-default)]">
    <template v-if="wizard.isSubmitted.value">
      <RegistrationConfirmation
        :confirmation-number="wizard.confirmationNumber.value"
        :attendee-name="wizard.registration.attendee.fullName"
        :attendee-email="wizard.registration.attendee.email"
        :ticket-type="wizard.selectedTicket.value"
        @back-home="wizard.resetRegistration"
      />
    </template>

    <template v-else>
      <ProcessBar
        :steps="wizard.steps.value"
        :current-step="wizard.currentStep.value"
        :invalid-steps="wizard.invalidSteps.value"
        @select-step="wizard.goToStep"
      />

      <main class="flex-1 min-h-0 overflow-y-auto">
      <div class="wrapper py-6 tablet:py-10">
        <FormStepOne
          v-if="wizard.currentStep.value === 1"
          v-model:attendee="wizard.registration.attendee"
          v-model:selected-ticket-id="wizard.registration.ticketTypeId"
          :ticket-types="wizard.ticketTypes.value"
          :has-merchandise-selected="wizard.hasMerchandiseSelected.value"
          :show-validation="wizard.hasAttemptedSubmit.value"
          :step-errors="wizard.visibleValidationResult.value.byStep[1]"
        />
        <FormStepTwo
          v-else-if="wizard.currentStep.value === 2"
          v-model:selected-session-ids="wizard.registration.selectedSessionIds"
          :grouped-sessions="wizard.groupedSessions.value"
        />
        <FormStepThree
          v-else-if="wizard.currentStep.value === 3"
          v-model:selected-addons="wizard.registration.selectedAddons"
          :workshops="wizard.workshops.value"
          :meals="wizard.meals.value"
          :merchandise="wizard.merchandise.value"
          :selected-sessions="wizard.selectedSessions.value"
          :included-meal-ids="wizard.includedMealIds.value"
          :order-line-items="wizard.orderLineItems.value"
          :order-total="wizard.orderTotal.value"
        />
        <FormStepFour
          v-else-if="wizard.currentStep.value === 4"
          :registration="wizard.registration"
          :selected-ticket="wizard.selectedTicket.value"
          :selected-sessions="wizard.selectedSessions.value"
          :selected-workshops="wizard.selectedWorkshops.value"
          :selected-meals="wizard.selectedMeals.value"
          :selected-merchandise="wizard.selectedMerchandise.value"
          :has-merchandise-selected="wizard.hasMerchandiseSelected.value"
          :order-line-items="wizard.orderLineItems.value"
          :order-total="wizard.orderTotal.value"
          :validation-result="wizard.visibleValidationResult.value"
          @edit-step="wizard.goToStep"
        />
        <section
          v-else
          class="min-h-[320px] rounded border border-neutral-muted bg-surface-l1 p-6"
        >
          <p class="text-subtitle1 text-neutral">
            {{ wizard.steps[wizard.currentStep.value - 1].label }}
          </p>
          <p class="mt-2 text-lg text-neutral-muted">
            {{ t('common.step') }} {{ wizard.currentStep.value }}
          </p>
        </section>
      </div>
      </main>

      <WizardFooter
        :primary-label="wizard.nextStepLabel.value"
        :show-back="wizard.canGoPrevious.value"
        :primary-disabled="wizard.isSubmitDisabled.value"
        @back="wizard.goToPreviousStep"
        @next="wizard.handlePrimaryAction"
      />
    </template>
  </div>
</template>
