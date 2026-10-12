// internal imports
import type { UserInterface } from '@/interfaces/UserInterface.js';

export interface LoginDTO {
  email: string;
  password: string;
}

// The public registration form never sends isAdmin; the backend forces it to false.
export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: UserInterface;
}
