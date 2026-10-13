// Converts between the ISO strings used by the API and the "YYYY-MM-DDTHH:mm" value
// that <input type="datetime-local"> reads and writes (always in the user's local time).
export default class DateInputConverter {
  public static toInputValue(iso?: string): string {
    if (!iso) {
      return '';
    }

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const offsetMs = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
  }

  public static toIso(inputValue: string): string {
    const date = new Date(inputValue);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
  }
}
