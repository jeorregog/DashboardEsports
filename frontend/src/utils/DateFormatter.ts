export default class DateFormatter {
  public static formatShortDate(iso?: string): string {
    if (!iso) {
      return '';
    }

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return formatter.format(date);
  }
}
