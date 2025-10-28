
export function toTimestamp(dateInput: string | Date, timeInput?: string | Date): string {
  const date = new Date(dateInput);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let timeString = "00:00:00";

  // ตรวจว่า timeInput เป็น Date object
  if (timeInput instanceof Date) {
    const h = String(timeInput.getHours()).padStart(2, "0");
    const m = String(timeInput.getMinutes()).padStart(2, "0");
    const s = String(timeInput.getSeconds()).padStart(2, "0");
    timeString = `${h}:${m}:${s}`;
  }
  // หรือเป็น string (เช่น "10:30:00")
  else if (typeof timeInput === "string" && timeInput.trim() !== "") {
    timeString = timeInput;
  }

  return `${year}-${month}-${day} ${timeString}`;
}
