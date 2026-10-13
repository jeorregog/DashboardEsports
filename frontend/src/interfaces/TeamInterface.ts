// internal imports
import type { PlayerInterface } from '@/interfaces/PlayerInterface.js';

export interface TeamInterface {
  id: number;
  name: string;
  followers: number;
  country: string;
  // Only present when the backend loads the relation (team list and team detail).
  players?: PlayerInterface[];
  createdAt: string;
  updatedAt: string;
}
