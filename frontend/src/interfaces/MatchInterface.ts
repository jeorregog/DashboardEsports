// internal imports
import type { TeamInterface } from '@/interfaces/TeamInterface.js';

export interface MatchInterface {
  id: number;
  game: string;
  date: string;
  team1: TeamInterface;
  team2: TeamInterface;
  winner: TeamInterface;
}
