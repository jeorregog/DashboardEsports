export default class CurrencyFormatter {
  public static formatUsd(amount: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

    return formatter.format(amount);
  }
}
