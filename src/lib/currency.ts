/**
 * Nigerian Naira (NGN / ₦) Currency Formatter and Utilities
 */

export const CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦';
export const CURRENCY_CODE = process.env.NEXT_PUBLIC_CURRENCY_CODE || 'NGN';

/**
 * Format a numeric amount into standard Nigerian Naira string: ₦4,500.00
 */
export function formatNaira(amount: number | string | undefined | null, includeDecimals = true): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
  if (isNaN(num)) return `${CURRENCY_SYMBOL}0.00`;

  return `${CURRENCY_SYMBOL}${num.toLocaleString('en-NG', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  })}`;
}

export const formatCurrency = formatNaira;

export default formatNaira;
