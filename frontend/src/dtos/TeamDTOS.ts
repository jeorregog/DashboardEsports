// internal imports
import type { TeamInterface } from '@/interfaces/TeamInterface.js';

export type CreateTeamDTO = Pick<TeamInterface, 'name' | 'followers' | 'country'>;
export type UpdateTeamDTO = Partial<CreateTeamDTO>;
