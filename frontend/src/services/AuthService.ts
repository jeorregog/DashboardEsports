// internal imports
import { ApiClient } from '@/services/ApiClient.js';
import type { AuthResponseDTO, LoginDTO, RegisterDTO } from '@/dtos/AuthDTOS.js';
import AuthStorage from '@/utils/AuthStorage.js';
import JwtDecoder from '@/utils/JwtDecoder.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';

export class AuthService {
  private static readonly API_URL = '/api/auth';

  public static async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const { data } = await ApiClient.instance.post<AuthResponseDTO>(
      `${AuthService.API_URL}/register`,
      dto,
    );
    AuthService.persistSession(data);
    return data;
  }

  public static async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    const { data } = await ApiClient.instance.post<AuthResponseDTO>(
      `${AuthService.API_URL}/login`,
      dto,
    );
    AuthService.persistSession(data);
    return data;
  }

  // The backend is stateless (JWT only), so logging out just discards the local session.
  public static logout(): void {
    AuthStorage.clear();
  }

  public static getToken(): string | null {
    return AuthStorage.getToken();
  }

  // The backend has no "current user" endpoint, so the session is rebuilt from the stored token
  // and user. isAdmin is always taken from the token claim, not from the stored user object.
  public static loadCurrentUser(): UserInterface | null {
    const token = AuthStorage.getToken();
    const storedUser = AuthStorage.getUser();

    if (!token || !storedUser || JwtDecoder.isExpired(token)) {
      AuthStorage.clear();
      return null;
    }

    const payload = JwtDecoder.decode(token);

    if (!payload || payload.sub !== storedUser.id) {
      AuthStorage.clear();
      return null;
    }

    return { ...storedUser, isAdmin: payload.isAdmin };
  }

  private static persistSession(response: AuthResponseDTO): void {
    AuthStorage.setToken(response.token);
    AuthStorage.setUser(response.user);
  }
}
