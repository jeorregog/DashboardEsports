// internal imports
import type { CreateMatchDTO } from '@/dtos/MatchDTOS.js';

export default class MatchFormValidator {
  // Returns an error message, or an empty string when the match data is valid.
  public static validate(match: CreateMatchDTO): string {
    if (!match.game || !match.date || !match.team1Id || !match.team2Id || !match.winnerId) {
      return 'Fill in all required fields.';
    }

    if (match.team1Id === match.team2Id) {
      return 'A team cannot play against itself.';
    }

    if (match.winnerId !== match.team1Id && match.winnerId !== match.team2Id) {
      return 'The winner must be one of the two teams playing.';
    }

    return '';
  }
}
