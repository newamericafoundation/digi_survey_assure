export function formatDataForInput(inputDate: string): string {
    const dateObject = new Date(inputDate);

    const month = dateObject.getUTCMonth() + 1;
    const day = dateObject.getUTCDate();

    return [
        dateObject.getUTCFullYear(),
        (month < 10) ? `0${month}` : month,
        (day < 10) ? `0${day}` : day,
    ].join('-');
}
