import { describe, it, expect } from 'vitest';
import { formatINR } from './currency';

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
