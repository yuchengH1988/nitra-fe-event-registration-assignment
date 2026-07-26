import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  createEmptyValidationResult,
  validateRegistration,
} from 'src/composables/useRegistrationValidation.js'
import { useRegistrationCopy } from 'src/composables/useRegistrationCopy.js'
import { addons } from 'src/mocks/addons.js'
import { event } from 'src/mocks/event.js'
import { sessions } from 'src/mocks/sessions.js'
import { groupSessionsByDate } from 'src/utils/registration-data.js'
import {
  findTimeConflicts,
  findWorkshopSessionConflicts,
} from 'src/utils/schedule.js'

export const REGISTRATION_STEPS = [
  { number: 1, labelKey: 'steps.attendeeInfo', nextStepLabelKey: 'actions.nextSessionSelection' },
  { number: 2, labelKey: 'steps.sessions', nextStepLabelKey: 'actions.nextAddons' },
  { number: 3, labelKey: 'steps.addons', nextStepLabelKey: 'actions.nextReview' },
  { number: 4, labelKey: 'steps.review', nextStepLabelKey: 'actions.submitRegistration' },
]

const INITIAL_ATTENDEE = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  shippingAddress: '',
}

const VIP_INCLUDED_MEAL_IDS = ['meal1']

/**
 * Creates the feature-scoped state for the four-step registration wizard.
 *
 * Keep raw user input here and expose selected entities / availability as
 * computed values so later steps do not duplicate state.
 *
 * @returns {object} Registration wizard state, derived data, and actions.
 */
export function useRegistrationWizard() {
  const { t } = useI18n()
  const {
    ticketName,
    addonName,
  } = useRegistrationCopy()

  const currentStep = ref(1)
  const hasAttemptedSubmit = ref(false)
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const confirmationNumber = ref('FTC2028-47291')

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
    meals.value.filter((meal) =>
      registration.selectedAddons.meals.includes(meal.id) ||
      includedMealIds.value.includes(meal.id),
    ),
  )

  const includedMealIds = computed(() =>
    registration.ticketTypeId === 'vip'
      ? VIP_INCLUDED_MEAL_IDS
      : [],
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

  const ticketLineItem = computed(() => {
    if (!selectedTicket.value) return null

    const name = ticketName(selectedTicket.value)

    return {
      id: selectedTicket.value.id,
      category: 'ticket',
      label: t('summary.ticketLine', { ticket: name }),
      quantity: 1,
      unitPrice: selectedTicket.value.price,
      subtotal: selectedTicket.value.price,
      total: selectedTicket.value.price,
    }
  })

  const workshopLineItems = computed(() =>
    selectedWorkshops.value.map((workshop) => ({
      id: workshop.id,
      category: 'workshop',
      label: addonName(workshop),
      quantity: 1,
      unitPrice: workshop.price,
      subtotal: workshop.price,
      total: workshop.price,
    })),
  )

  const mealLineItems = computed(() =>
    selectedMeals.value.map((meal) => ({
      id: meal.id,
      category: 'meal',
      label: includedMealIds.value.includes(meal.id)
        ? `${addonName(meal)} ${t('summary.includedMealSuffix')}`
        : addonName(meal),
      quantity: 1,
      unitPrice: includedMealIds.value.includes(meal.id) ? 0 : meal.price,
      subtotal: includedMealIds.value.includes(meal.id) ? 0 : meal.price,
      total: includedMealIds.value.includes(meal.id) ? 0 : meal.price,
    })),
  )

  const merchandiseLineItems = computed(() =>
    selectedMerchandise.value.map((item) => ({
      id: item.id,
      category: 'merchandise',
      label: addonName(item),
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity,
      total: item.price * item.quantity,
    })),
  )

  const subtotalLineItems = computed(() =>
    [
      ticketLineItem.value,
      ...workshopLineItems.value,
      ...mealLineItems.value,
      ...merchandiseLineItems.value,
    ].filter(Boolean),
  )

  const workshopDiscount = computed(() => {
    if (registration.ticketTypeId !== 'vip') return 0

    return workshopLineItems.value.reduce(
      (total, item) => total + item.subtotal * 0.1,
      0,
    )
  })

  const orderLineItems = computed(() => {
    const items = [
      ticketLineItem.value,
      ...workshopLineItems.value,
      ...mealLineItems.value,
      ...merchandiseLineItems.value,
    ].filter(Boolean)

    if (workshopDiscount.value > 0) {
      items.push({
        id: 'vip-workshop-discount',
        category: 'discount',
        label: t('summary.workshopDiscount'),
        quantity: 1,
        unitPrice: -workshopDiscount.value,
        subtotal: -workshopDiscount.value,
        total: -workshopDiscount.value,
      })
    }

    return items
  })

  const orderTotal = computed(() =>
    orderLineItems.value.reduce((total, item) => total + item.total, 0),
  )

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
  const steps = computed(() =>
    REGISTRATION_STEPS.map((step) => ({
      ...step,
      label: t(step.labelKey),
      nextStepLabel: t(step.nextStepLabelKey),
    })),
  )
  const nextStepLabel = computed(() => {
    const step = steps.value.find(
      (item) => item.number === currentStep.value,
    )

    return step?.nextStepLabel ?? t('actions.submitRegistration')
  })

  const isSubmitDisabled = computed(
    () =>
      currentStep.value === REGISTRATION_STEPS.length &&
      hasAttemptedSubmit.value &&
      validationResult.value.all.length > 0,
  )

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
      return false
    }

    isSubmitted.value = true
    return true
  }

  function resetRegistration() {
    Object.assign(registration.attendee, INITIAL_ATTENDEE)
    registration.ticketTypeId = 'vip'
    registration.selectedSessionIds = []
    registration.selectedAddons.workshops = []
    registration.selectedAddons.meals = []
    registration.selectedAddons.merchandise = {}
    currentStep.value = 1
    hasAttemptedSubmit.value = false
    isSubmitting.value = false
    isSubmitted.value = false
  }

  function handlePrimaryAction() {
    if (isSubmitDisabled.value) return

    if (currentStep.value === REGISTRATION_STEPS.length) {
      submitRegistration()
      return
    }

    goToNextStep()
  }

  return {
    steps,
    currentStep,
    hasAttemptedSubmit,
    isSubmitting,
    isSubmitDisabled,
    isSubmitted,
    confirmationNumber,
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
    includedMealIds,
    selectedMerchandise,
    hasMerchandiseSelected,
    ticketLineItem,
    workshopLineItems,
    mealLineItems,
    merchandiseLineItems,
    subtotalLineItems,
    workshopDiscount,
    orderLineItems,
    orderTotal,
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
    resetRegistration,
  }
}
