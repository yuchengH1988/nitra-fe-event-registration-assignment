const REQUIRED_ATTENDEE_FIELDS = [
  ['fullName', 'Full name is required.'],
  ['email', 'Email is required.'],
  ['phone', 'Phone is required.'],
  ['company', 'Company is required.'],
  ['jobTitle', 'Job title is required.'],
]

function createError(step, code, field, message, relatedIds = []) {
  return {
    step,
    code,
    field,
    message,
    relatedIds,
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone) {
  return /^[+()\d\s-]{7,}$/.test(phone)
}

/**
 * Validates the full registration payload for Step 4 unified submit.
 *
 * @param {object} payload
 * @returns {{ byStep: Record<number, Array<object>>, all: Array<object> }}
 */
export function validateRegistration(payload) {
  const {
    registration,
    sessionConflicts,
    workshopConflicts,
    hasMerchandiseSelected,
  } = payload

  const byStep = {
    1: [],
    2: [],
    3: [],
    4: [],
  }

  for (const [field, message] of REQUIRED_ATTENDEE_FIELDS) {
    if (String(registration.attendee[field]).trim()) continue

    byStep[1].push(createError(1, `REQUIRED_${field.toUpperCase()}`, field, message))
  }

  if (registration.attendee.email.trim() && !isValidEmail(registration.attendee.email)) {
    byStep[1].push(createError(1, 'INVALID_EMAIL', 'email', 'Enter a valid email address.'))
  }

  if (registration.attendee.phone.trim() && !isValidPhone(registration.attendee.phone)) {
    byStep[1].push(createError(1, 'INVALID_PHONE', 'phone', 'Enter a valid phone number.'))
  }

  if (!registration.ticketTypeId) {
    byStep[1].push(createError(1, 'REQUIRED_TICKET', 'ticketTypeId', 'Select a ticket type.'))
  }

  if (hasMerchandiseSelected && !registration.attendee.shippingAddress.trim()) {
    byStep[1].push(
      createError(
        1,
        'REQUIRED_SHIPPING_ADDRESS',
        'shippingAddress',
        'Shipping address is required for merchandise orders',
      ),
    )
  }

  for (const conflict of sessionConflicts) {
    byStep[2].push(
      createError(
        2,
        'SESSION_TIME_CONFLICT',
        'sessions',
        'Some selected sessions overlap.',
        [conflict.firstId, conflict.secondId],
      ),
    )
  }

  for (const conflict of workshopConflicts) {
    byStep[3].push(
      createError(
        3,
        'WORKSHOP_SESSION_CONFLICT',
        'workshops',
        'A selected workshop overlaps with a selected session.',
        [conflict.workshopId, conflict.sessionId],
      ),
    )
  }

  return {
    byStep,
    all: Object.values(byStep).flat(),
  }
}

export function createEmptyValidationResult() {
  return {
    byStep: {
      1: [],
      2: [],
      3: [],
      4: [],
    },
    all: [],
  }
}
