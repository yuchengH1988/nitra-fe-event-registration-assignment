export function formatCurrency(amount, options = {}) {
  const maximumFractionDigits = options.maximumFractionDigits ?? 2
  const minimumFractionDigits = Math.min(
    options.minimumFractionDigits ?? maximumFractionDigits,
    maximumFractionDigits,
  )

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(amount))
}
