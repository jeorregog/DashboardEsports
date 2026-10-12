// internal imports
import type { UserInterface } from '@/interfaces/UserInterface.js';

export default class AuthStorage {
  private static readonly TOKEN_KEY = 'auth.token';
  private static readonly USER_KEY = 'auth.user';

  public static getToken(): string | null {
    return localStorage.getItem(AuthStorage.TOKEN_KEY);
  }

  public static setToken(token: string): void {
    localStorage.setItem(AuthStorage.TOKEN_KEY, token);
  }

  public static getUser(): UserInterface | null {
    const rawUser = localStorage.getItem(AuthStorage.USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as UserInterface;
    } catch {
      return null;
    }
  }

  public static setUser(user: UserInterface): void {
    localStorage.setItem(AuthStorage.USER_KEY, JSON.stringify(user));
  }

  public static clear(): void {
    localStorage.removeItem(AuthStorage.TOKEN_KEY);
    localStorage.removeItem(AuthStorage.USER_KEY);
  }
}
