// The backend receives the three teams as ids, while it returns them as nested objects.
export interface CreateMatchDTO {
  game: string;
  date: string;
  team1Id: number;
  team2Id: number;
  winnerId: number;
}

export type UpdateMatchDTO = Partial<CreateMatchDTO>;
