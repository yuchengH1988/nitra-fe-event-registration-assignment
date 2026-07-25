/**
 * Returns true when two date/endDate ranges overlap.
 * Adjacent ranges, such as 09:00-10:00 and 10:00-11:00, do not overlap.
 *
 * @param {{ date: string, endDate: string }} first
 * @param {{ date: string, endDate: string }} second
 * @returns {boolean}
 */
export function doTimeRangesOverlap(first, second) {
  const firstStart = new Date(first.date).getTime()
  const firstEnd = new Date(first.endDate).getTime()
  const secondStart = new Date(second.date).getTime()
  const secondEnd = new Date(second.endDate).getTime()

  return firstStart < secondEnd && secondStart < firstEnd
}

/**
 * Finds every overlapping pair in a list of scheduled items.
 *
 * @param {Array<{ id: string, date: string, endDate: string }>} items
 * @returns {Array<{ id: string, firstId: string, secondId: string, first: object, second: object }>}
 */
export function findTimeConflicts(items) {
  const conflicts = []

  for (let firstIndex = 0; firstIndex < items.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < items.length; secondIndex += 1) {
      const first = items[firstIndex]
      const second = items[secondIndex]

      if (!doTimeRangesOverlap(first, second)) continue

      conflicts.push({
        id: `${first.id}__${second.id}`,
        firstId: first.id,
        secondId: second.id,
        first,
        second,
      })
    }
  }

  return conflicts
}

/**
 * Finds selected workshops that overlap with selected sessions.
 *
 * @param {Array<{ id: string, date: string, endDate: string }>} workshops
 * @param {Array<{ id: string, date: string, endDate: string }>} sessions
 * @returns {Array<{ id: string, workshopId: string, sessionId: string, workshop: object, session: object }>}
 */
export function findWorkshopSessionConflicts(workshops, sessions) {
  return workshops.flatMap((workshop) =>
    sessions
      .filter((session) => doTimeRangesOverlap(workshop, session))
      .map((session) => ({
        id: `${workshop.id}__${session.id}`,
        workshopId: workshop.id,
        sessionId: session.id,
        workshop,
        session,
      })),
  )
}
