import assert from 'node:assert';
import test from 'node:test';
import { convertToINR, EXCHANGE_RATES_TO_INR } from './currency.ts';

test('convertToINR handles known currencies', () => {
    assert.strictEqual(convertToINR(100, 'USD'), 100 * EXCHANGE_RATES_TO_INR.USD);
    assert.strictEqual(convertToINR(50, 'EUR'), 50 * EXCHANGE_RATES_TO_INR.EUR);
});

test('convertToINR is case-insensitive', () => {
    assert.strictEqual(convertToINR(100, 'usd'), 100 * EXCHANGE_RATES_TO_INR.USD);
    assert.strictEqual(convertToINR(50, 'eUr'), 50 * EXCHANGE_RATES_TO_INR.EUR);
});

test('convertToINR handles unknown currencies with fallback rate of 1', () => {
    assert.strictEqual(convertToINR(100, 'UNKNOWN'), 100);
    assert.strictEqual(convertToINR(50, 'XYZ'), 50);
});

test('convertToINR handles INR to INR conversion correctly', () => {
    assert.strictEqual(convertToINR(100, 'INR'), 100);
});
