import { computed, reactive, ref } from 'vue'
import {
  createEmptyValidationResult,
  validateRegistration,
} from 'src/composables/useRegistrationValidation.js'
import { addons } from 'src/mocks/addons.js'
import { event } from 'src/mocks/event.js'
import { sessions } from 'src/mocks/sessions.js'
import { groupSessionsByDate } from 'src/utils/registration-data.js'
import {
  findTimeConflicts,
  findWorkshopSessionConflicts,
} from 'src/utils/schedule.js'

export const REGISTRATION_STEPS = [
  { number: 1, label: 'Attendee Info', nextStepLabel: 'Next: Session Selection' },
  { number: 2, label: 'Sessions', nextStepLabel: 'Next: Add-ons' },
  { number: 3, label: 'Add-ons', nextStepLabel: 'Next: Review' },
  { number: 4, label: 'Review', nextStepLabel: 'Submit Registration' },
]

const INITIAL_ATTENDEE = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  shippingAddress: '',
}

/**
 * Creates the feature-scoped state for the four-step registration wizard.
 *
 * Keep raw user input here and expose selected entities / availability as
 * computed values so later steps do not duplicate state.
 *
 * @returns {object} Registration wizard state, derived data, and actions.
 */
export function useRegistrationWizard() {
  const currentStep = ref(1)
  const hasAttemptedSubmit = ref(false)
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)

  const registration = reactive({
    attendee: { ...INITIAL_ATTENDEE },
    ticketTypeId: 'vip',
    selectedSessionIds: [],
    selectedAddons: {
      workshops: [],
      meals: [],
      merchandise: {},
    },
  })

  const ticketTypes = computed(() => event.ticketTypes)

  const selectedTicket = computed(() =>
    ticketTypes.value.find((ticket) => ticket.id === registration.ticketTypeId) ?? null,
  )

  const selectedSessions = computed(() =>
    sessions.filter((session) => registration.selectedSessionIds.includes(session.id)),
  )

  const groupedSessions = computed(() => groupSessionsByDate(sessions))

  const workshops = computed(() =>
    addons.filter((addon) => addon.category === 'workshop'),
  )

  const meals = computed(() =>
    addons.filter((addon) => addon.category === 'meal'),
  )

  const merchandise = computed(() =>
    addons.filter((addon) => addon.category === 'merchandise'),
  )

  const selectedWorkshops = computed(() =>
    workshops.value.filter((workshop) =>
      registration.selectedAddons.workshops.includes(workshop.id),
    ),
  )

  const selectedMeals = computed(() =>
    meals.value.filter((meal) => registration.selectedAddons.meals.includes(meal.id)),
  )

  const selectedMerchandise = computed(() =>
    merchandise.value
      .map((item) => ({
        ...item,
        quantity: Number(registration.selectedAddons.merchandise[item.id]?.quantity ?? 0),
        size: registration.selectedAddons.merchandise[item.id]?.size ?? null,
      }))
      .filter((item) => item.quantity > 0),
  )

  const hasMerchandiseSelected = computed(() => selectedMerchandise.value.length > 0)

  const sessionConflicts = computed(() => findTimeConflicts(selectedSessions.value))

  const workshopConflicts = computed(() =>
    findWorkshopSessionConflicts(selectedWorkshops.value, selectedSessions.value),
  )

  const validationResult = computed(() =>
    validateRegistration({
      registration,
      sessionConflicts: sessionConflicts.value,
      workshopConflicts: workshopConflicts.value,
      hasMerchandiseSelected: hasMerchandiseSelected.value,
    }),
  )

  const visibleValidationResult = computed(() =>
    hasAttemptedSubmit.value
      ? validationResult.value
      : createEmptyValidationResult(),
  )

  const invalidSteps = computed(() =>
    Object.entries(visibleValidationResult.value.byStep)
      .filter(([, errors]) => errors.length > 0)
      .map(([step]) => Number(step)),
  )

  const firstInvalidStep = computed(() => invalidSteps.value[0] ?? null)

  const canGoPrevious = computed(() => currentStep.value > 1)
  const canGoNext = computed(() => currentStep.value < REGISTRATION_STEPS.length)
  const nextStepLabel = computed(() => {
    const step = REGISTRATION_STEPS.find(
      (item) => item.number === currentStep.value,
    )

    return step?.nextStepLabel ?? 'Submit Registration'
  })

  function goToStep(stepNumber) {
    const targetStep = REGISTRATION_STEPS.find((step) => step.number === stepNumber)

    if (!targetStep) return

    currentStep.value = targetStep.number
  }

  function goToPreviousStep() {
    if (!canGoPrevious.value) return

    currentStep.value -= 1
  }

  function goToNextStep() {
    if (!canGoNext.value) return

    currentStep.value += 1
  }

  function submitRegistration() {
    hasAttemptedSubmit.value = true

    if (firstInvalidStep.value) {
      goToStep(firstInvalidStep.value)
      return false
    }

    isSubmitted.value = true
    return true
  }

  function handlePrimaryAction() {
    if (currentStep.value === REGISTRATION_STEPS.length) {
      submitRegistration()
      return
    }

    goToNextStep()
  }

  return {
    steps: REGISTRATION_STEPS,
    currentStep,
    hasAttemptedSubmit,
    isSubmitting,
    isSubmitted,
    registration,
    ticketTypes,
    selectedTicket,
    selectedSessions,
    groupedSessions,
    workshops,
    meals,
    merchandise,
    selectedWorkshops,
    selectedMeals,
    selectedMerchandise,
    hasMerchandiseSelected,
    sessionConflicts,
    workshopConflicts,
    validationResult,
    visibleValidationResult,
    invalidSteps,
    firstInvalidStep,
    canGoPrevious,
    canGoNext,
    nextStepLabel,
    goToStep,
    goToPreviousStep,
    goToNextStep,
    submitRegistration,
    handlePrimaryAction,
  }
}
