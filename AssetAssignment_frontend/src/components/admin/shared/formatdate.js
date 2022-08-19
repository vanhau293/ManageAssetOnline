export function FormatDate(date){
    const year = +date.substring(0, 4);
    const month = +date.substring(5, 7);
    const day = +date.substring(8, 10);
    const formatDate = day+ "/" + month + "/" + year;
    return formatDate;
}