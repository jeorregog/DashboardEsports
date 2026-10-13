// internal imports
import { ApiClient } from '@/services/ApiClient.js';
import type { CreateTeamDTO, UpdateTeamDTO } from '@/dtos/TeamDTOS.js';
import type { TeamInterface } from '@/interfaces/TeamInterface.js';

export class TeamService {
  private static readonly API_URL = '/api/teams';

  public static async getAll(): Promise<TeamInterface[]> {
    const { data } = await ApiClient.instance.get<TeamInterface[]>(TeamService.API_URL);
    return data;
  }

  public static async getById(id: number): Promise<TeamInterface> {
    const { data } = await ApiClient.instance.get<TeamInterface>(`${TeamService.API_URL}/${id}`);
    return data;
  }

  public static async create(team: CreateTeamDTO): Promise<TeamInterface> {
    const { data } = await ApiClient.instance.post<TeamInterface>(TeamService.API_URL, team);
    return data;
  }

  public static async update(id: number, team: UpdateTeamDTO): Promise<TeamInterface> {
    const { data } = await ApiClient.instance.patch<TeamInterface>(
      `${TeamService.API_URL}/${id}`,
      team,
    );
    return data;
  }

  public static async delete(id: number): Promise<void> {
    await ApiClient.instance.delete(`${TeamService.API_URL}/${id}`);
  }
}
