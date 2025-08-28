export function formatDate(dateStr) {
    const date = new Date(dateStr);

    const options = { year: "numeric", month: "long", day: "numeric" };
    try {
        return date.toLocaleDateString("en-US", options);
    } catch (error) {
        return date;
    }
}
