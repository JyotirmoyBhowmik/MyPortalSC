// Basic static conversion rates. In a real-world multi-year system, this could be
// fetched from an API or database for historical rates.
export const EXCHANGE_RATES_TO_INR: Record<string, number> = {
    USD: 83.50,
    EUR: 89.20,
    GBP: 105.10,
    JPY: 0.55,
    AUD: 54.30,
    CAD: 61.20,
    INR: 1.00
};

export const AVAILABLE_CURRENCIES = Object.keys(EXCHANGE_RATES_TO_INR);

export function convertToINR(amount: number, currency: string): number {
    const rate = EXCHANGE_RATES_TO_INR[currency.toUpperCase()] || 1;
    return amount * rate;
}

export function formatINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}
