import { useI18n } from 'vue-i18n'

export function useRegistrationCopy() {
  const { t, tm, locale } = useI18n()

  function translateMapValue(path, key, fallback, property = null) {
    const values = tm(path)
    const value = values?.[key]

    if (!value) return fallback
    if (!property) return value

    return value[property] ?? fallback
  }

  function ticketName(ticket) {
    return translateMapValue('data.tickets', ticket.id, ticket.name, 'name')
  }

  function ticketDescription(ticket) {
    return translateMapValue('data.tickets', ticket.id, ticket.description, 'description')
  }

  function ticketPerk(perk) {
    return translateMapValue('data.perks', perk, perk)
  }

  function addonName(addon) {
    return translateMapValue('data.addons', addon.id, addon.name, 'name')
  }

  function addonDescription(addon) {
    return translateMapValue('data.addons', addon.id, addon.description, 'description')
  }

  function sessionTitle(session) {
    return translateMapValue('data.sessions', session.id, session.title, 'title')
  }

  function speakerTitle(session) {
    return translateMapValue('data.sessions', session.id, session.speakerTitle, 'speakerTitle')
  }

  return {
    t,
    locale,
    ticketName,
    ticketDescription,
    ticketPerk,
    addonName,
    addonDescription,
    sessionTitle,
    speakerTitle,
  }
}
