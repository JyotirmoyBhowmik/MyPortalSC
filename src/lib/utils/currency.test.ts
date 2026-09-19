import { describe, it, expect } from 'vitest';
import { formatINR, convertToINR, EXCHANGE_RATES_TO_INR, convertFromINR, formatCurrency } from './currency';

describe('formatINR', () => {
    it('formats zero correctly', () => {
        expect(formatINR(0)).toBe('₹0');
    });

    it('formats positive numbers correctly', () => {
        expect(formatINR(100)).toBe('₹100');
        expect(formatINR(5000)).toBe('₹5,000');
    });

    it('formats negative numbers correctly', () => {
        expect(formatINR(-100)).toBe('-₹100');
        expect(formatINR(-5000)).toBe('-₹5,000');
    });

    it('formats large numbers correctly using Indian numbering system (lakhs, crores)', () => {
        // 1 lakh = 100,000
        expect(formatINR(100000)).toBe('₹1,00,000');
        // 10 lakhs = 1,000,000
        expect(formatINR(1000000)).toBe('₹10,00,000');
        // 1 crore = 10,000,000
        expect(formatINR(10000000)).toBe('₹1,00,00,000');
    });

    it('rounds decimal numbers to 0 fraction digits', () => {
        expect(formatINR(100.4)).toBe('₹100');
        expect(formatINR(100.5)).toBe('₹101');
        expect(formatINR(100.6)).toBe('₹101');
    });
});

describe('convertToINR', () => {
    it('handles known currencies', () => {
        expect(convertToINR(100, 'USD')).toBe(100 * EXCHANGE_RATES_TO_INR.USD);
        expect(convertToINR(50, 'EUR')).toBe(50 * EXCHANGE_RATES_TO_INR.EUR);
    });

    it('is case-insensitive', () => {
        expect(convertToINR(100, 'usd')).toBe(100 * EXCHANGE_RATES_TO_INR.USD);
        expect(convertToINR(50, 'eUr')).toBe(50 * EXCHANGE_RATES_TO_INR.EUR);
    });

    it('handles unknown currencies with fallback rate of 1', () => {
        expect(convertToINR(100, 'UNKNOWN')).toBe(100);
        expect(convertToINR(50, 'XYZ')).toBe(50);
    });

    it('handles INR to INR conversion correctly', () => {
        expect(convertToINR(100, 'INR')).toBe(100);
    });
});

describe('convertFromINR and formatCurrency', () => {
    it('converts INR to target currencies correctly', () => {
        const inr = 8350;
        expect(convertFromINR(inr, 'USD')).toBeCloseTo(100, 1);
        expect(convertFromINR(inr, 'INR')).toBe(8350);
    });

    it('formats target currencies with valid currency symbols', () => {
        const inr = 83500;
        const usdFormatted = formatCurrency(inr, 'USD');
        expect(usdFormatted).toContain('$');
        const eurFormatted = formatCurrency(inr, 'EUR');
        expect(eurFormatted).toContain('€');
        const inrFormatted = formatCurrency(inr, 'INR');
        expect(inrFormatted).toContain('₹');
    });
});

