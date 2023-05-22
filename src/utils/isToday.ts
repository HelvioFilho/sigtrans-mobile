export function isToday(date: string) {
  const [day, moth, year] = date.split("/").map(Number);
  const inputDate = new Date(year, moth - 1, day);

  const today = new Date();
  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    return "Hoje";
  } else {
    return date;
  }
}
