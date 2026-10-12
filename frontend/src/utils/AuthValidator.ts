export default class AuthValidator {
  public static readonly MIN_PASSWORD_LENGTH = 6;
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static isValidEmail(email: string): boolean {
    return AuthValidator.EMAIL_PATTERN.test(email);
  }

  public static isValidPassword(password: string): boolean {
    return password.length >= AuthValidator.MIN_PASSWORD_LENGTH;
  }
}
