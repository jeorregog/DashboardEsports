// external imports
import axios from 'axios';

interface ApiErrorBody {
  message?: string | string[];
}

export default class ApiErrorParser {
  // Extracts a readable message from a NestJS error body, falling back to a generic one.
  public static getMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
      if (!error.response) {
        return 'Unable to reach the server. Please try again.';
      }

      const message = error.response.data?.message;

      if (Array.isArray(message) && message.length > 0) {
        return message.join(' ');
      }

      if (typeof message === 'string' && message) {
        return message;
      }
    }

    return fallback;
  }
}
