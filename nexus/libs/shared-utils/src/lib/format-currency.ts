import { CURRENCIES } from "./currencies.const";

const numberFormatMap = {
  [CURRENCIES.USD]: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCIES.USD,
    currencyDisplay: 'symbol',
  }),
  [CURRENCIES.EUR]: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCIES.EUR,
    currencyDisplay: 'symbol',
  }),
  [CURRENCIES.AED]: new Intl.NumberFormat('ar-AE', {
    style: 'currency',
    currency: CURRENCIES.AED,
    currencyDisplay: 'symbol',
  })
};

export function formatCurrency(amount: number, currency: keyof typeof CURRENCIES) {
  if (currency === CURRENCIES.AED) {
    return `\u202B${numberFormatMap[currency as keyof typeof numberFormatMap]?.format?.(amount) ?? ''}`;
  } else {  // for other currencies, we don't need to add the RTL marker as it is already in the correct direction
    return numberFormatMap[currency as keyof typeof numberFormatMap]?.format?.(amount) ?? '';
  }
}
