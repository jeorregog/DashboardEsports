export class CreateTeamDto {
  name: string;
  followers: number;
  country: string;
}

export class UpdateTeamDto {
  name?: string;
  followers?: number;
  country?: string;
}
