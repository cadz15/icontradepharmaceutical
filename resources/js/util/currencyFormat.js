export const formattedCurrency = (number) => {
    const safeNumber = parseFloat(number.toString());

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(safeNumber);
};
