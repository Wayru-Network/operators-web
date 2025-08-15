export const calculateDiscountSummary = (
    quantity: number,
    basePrice: number
) => {
    const factor = 0.99861188999;
    const bulkThreshold = 500;
    const bulkUnitPrice = 5.45;

    if (!quantity || quantity === 0) {
        return {
            unitPriceWithDiscount: 0,
            totalPriceWithDiscount: 0,
            totalPriceWithoutDiscount: 0,
            discountAmount: 0,
            percentOff: 0,
        };
    }

    const totalPriceWithoutDiscount = parseFloat((basePrice * quantity).toFixed(2));

    let unitPriceWithDiscount: number;

    if (quantity >= bulkThreshold) {
        unitPriceWithDiscount = bulkUnitPrice;
    } else if (quantity === 1) {
        unitPriceWithDiscount = basePrice;
    } else {
        unitPriceWithDiscount = parseFloat((basePrice * Math.pow(factor, quantity - 1)).toFixed(2));
    }

    const totalPriceWithDiscount = parseFloat((unitPriceWithDiscount * quantity).toFixed(2));
    const discountAmount = parseFloat((totalPriceWithoutDiscount - totalPriceWithDiscount).toFixed(2));
    const percentOff = parseFloat(((discountAmount / totalPriceWithoutDiscount) * 100).toFixed(2));

    return {
        unitPriceWithDiscount,
        totalPriceWithDiscount,
        totalPriceWithoutDiscount,
        discountAmount,
        percentOff,
    };
};
