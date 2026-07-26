/**
 * Gets the remaining seats for a capacity-based item.
 *
 * @param {{ capacity: number, registered: number }} item
 * @returns {number}
 */
export function getRemainingCapacity(item) {
  return Math.max(Number(item.capacity) - Number(item.registered), 0)
}

/**
 * Returns true when no seats are available.
 *
 * @param {{ capacity: number, registered: number }} item
 * @returns {boolean}
 */
export function isAtCapacity(item) {
  return getRemainingCapacity(item) === 0
}

/**
 * Groups sessions by YYYY-MM-DD and sorts each date group by start time.
 *
 * @param {Array<{ date: string }>} sessions
 * @returns {Array<{ date: string, label: string, sessions: Array<object> }>}
 */
export function groupSessionsByDate(sessions) {
  const groups = new Map()

  for (const session of sessions) {
    const date = session.date.slice(0, 10)

    if (!groups.has(date)) {
      groups.set(date, [])
    }

    groups.get(date).push(session)
  }

  return [...groups.entries()]
    .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
    .map(([date, items]) => ({
      date,
      label: formatSessionDateTab(date),
      sessions: [...items].sort((first, second) =>
        new Date(first.date).getTime() - new Date(second.date).getTime(),
      ),
    }))
}

/**
 * Formats a date label such as "Nov 15" using UTC to preserve mock intent.
 *
 * @param {string} date
 * @returns {string}
 */
export function formatSessionDateTab(date, locale = 'en') {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

/**
 * Formats a session time range using UTC to avoid local timezone shifts.
 *
 * @param {{ date: string, endDate: string }} item
 * @returns {string}
 */
export function formatSessionTimeRange(item, locale = 'en') {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })

  return `${formatter.format(new Date(item.date))} – ${formatter.format(new Date(item.endDate))}`
}

/**
 * Formats a compact review label such as "Nov 15, 9:00 AM".
 *
 * @param {{ date: string }} item
 * @returns {string}
 */
export function formatReviewSessionTime(item, locale = 'en') {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(new Date(item.date))
}
