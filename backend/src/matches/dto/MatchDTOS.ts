export class CreateMatchDto {
  game: string;
  date: string;
  team1Id: number;
  team2Id: number;
  winnerId: number;
}

export class UpdateMatchDto {
  game?: string;
  date?: string;
  team1Id?: number;
  team2Id?: number;
  winnerId?: number;
}
