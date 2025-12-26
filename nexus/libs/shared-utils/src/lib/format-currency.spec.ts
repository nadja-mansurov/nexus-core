
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format-currency'; // Adjust path
import { CURRENCIES } from './currencies.const';

describe('formatCurrency()', () => {
  it('should format USD correctly in en-US style', () => {
    const result = formatCurrency(1234.56, CURRENCIES.USD as keyof typeof CURRENCIES);
    // Non-breaking spaces (\u00A0) are sometimes used by Intl.NumberFormat
    // We can use .toContain or regex to be safe across environments
    expect(result).toMatch(/\$1,234\.56/);
  });

  it('should format EUR correctly in en-US style', () => {
    const result = formatCurrency(1234.56, CURRENCIES.EUR as keyof typeof CURRENCIES);
    expect(result).toContain('€');
    expect(result).toContain('1,234.56');
  });

  it('should format UAE currency using Arabic locale', () => {
    const result = formatCurrency(1000, CURRENCIES.AED as keyof typeof CURRENCIES);
    
    // Check for Arabic characters or the specific AED formatting
    // Note: In your source code, you have a bug: CURRENCIES.CAN is used for UAE.
    // This test will verify current behavior or help you catch that bug.
    expect(result).toMatch(/[\u0600-\u06FF]/); // Regex for Arabic characters
  });

  it('should handle zero and negative values', () => {
    expect(formatCurrency(0, CURRENCIES.USD as keyof typeof CURRENCIES)).toContain('$0.00');
    expect(formatCurrency(-50, CURRENCIES.USD as keyof typeof CURRENCIES)).toContain('-$50.00');
  });
});