export function formatCurrency(amount, options = {}) {
  const maximumFractionDigits = options.maximumFractionDigits ?? 2
  const minimumFractionDigits = Math.min(
    options.minimumFractionDigits ?? maximumFractionDigits,
    maximumFractionDigits,
  )
  const locale = options.locale ?? 'en-US'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(amount))
}
