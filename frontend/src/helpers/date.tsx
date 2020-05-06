export function formatDataForInput(inputDate: string): string {
    const dateObject = new Date(inputDate);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;

    return [
        dateObject.getFullYear(),
        (month < 10) ? `0${month}` : month,
        (day < 10) ? `0${day}` : day,
    ].join('-');
}
