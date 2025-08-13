export function centsToDollars(cents: string | number): number {
    const centsNum = typeof cents === "string" ? parseInt(cents) : cents;
    return Number((centsNum / 100).toFixed(2));
};
