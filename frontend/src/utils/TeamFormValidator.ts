// internal imports
import type { CreateTeamDTO } from '@/dtos/TeamDTOS.js';

export default class TeamFormValidator {
  // Returns an error message, or an empty string when the team data is valid.
  public static validate(team: CreateTeamDTO): string {
    if (!team.name || !team.country) {
      return 'Fill in all required fields.';
    }

    if (!Number.isInteger(team.followers) || team.followers < 0) {
      return 'Followers must be a non-negative integer.';
    }

    return '';
  }
}
