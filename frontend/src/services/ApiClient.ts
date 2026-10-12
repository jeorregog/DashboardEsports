// external imports
import axios, { type AxiosInstance } from 'axios';

// internal imports
import AuthStorage from '@/utils/AuthStorage.js';

const PUBLIC_AUTH_PATHS = ['/api/auth/login', '/api/auth/register'];

// Single shared Axios instance. Every service (Player, User, Team, Match, ...) must use it.
export class ApiClient {
  private static unauthorizedHandler: (() => void) | null = null;

  public static readonly instance: AxiosInstance = ApiClient.buildInstance();

  // Registered once from main.ts to avoid a circular dependency with the router and the store.
  public static setUnauthorizedHandler(handler: () => void): void {
    ApiClient.unauthorizedHandler = handler;
  }

  private static isPublicRequest(url?: string): boolean {
    return PUBLIC_AUTH_PATHS.some((path) => url?.includes(path));
  }

  private static buildInstance(): AxiosInstance {
    const instance = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

    instance.interceptors.request.use((config) => {
      const token = AuthStorage.getToken();

      if (token && !ApiClient.isPublicRequest(config.url)) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }

      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;

        // A 401 from login/register means wrong credentials, not an expired session.
        if (isUnauthorized && !ApiClient.isPublicRequest(error.config?.url)) {
          ApiClient.unauthorizedHandler?.();
        }

        return Promise.reject(error);
      },
    );

    return instance;
  }
}
