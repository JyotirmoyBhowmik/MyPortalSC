import { describe, it, expect } from 'vitest';
import { formatINR } from './currency';

describe('formatINR', () => {
    it('formats a standard positive integer correctly', () => {
        expect(formatINR(1000)).toBe('₹1,000');
    });

    it('formats zero correctly', () => {
        expect(formatINR(0)).toBe('₹0');
    });

    it('formats a negative integer correctly', () => {
        expect(formatINR(-500)).toBe('-₹500');
    });

    it('formats a number with decimals correctly, rounding since maximumFractionDigits is 0', () => {
        // 10.5 rounds up to 11
        expect(formatINR(10.5)).toBe('₹11');
        // 10.4 rounds down to 10
        expect(formatINR(10.4)).toBe('₹10');
    });

    it('formats large numbers correctly according to the Indian numbering system', () => {
        // 1 Lakh
        expect(formatINR(100000)).toBe('₹1,00,000');
        // 1 Crore
        expect(formatINR(10000000)).toBe('₹1,00,00,000');
    });
});
