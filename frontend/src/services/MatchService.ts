// internal imports
import { ApiClient } from '@/services/ApiClient.js';
import type { CreateMatchDTO, UpdateMatchDTO } from '@/dtos/MatchDTOS.js';
import type { MatchInterface } from '@/interfaces/MatchInterface.js';

export class MatchService {
  private static readonly API_URL = '/api/matches';

  public static async getAll(): Promise<MatchInterface[]> {
    const { data } = await ApiClient.instance.get<MatchInterface[]>(MatchService.API_URL);
    return data;
  }

  public static async getById(id: number): Promise<MatchInterface> {
    const { data } = await ApiClient.instance.get<MatchInterface>(`${MatchService.API_URL}/${id}`);
    return data;
  }

  public static async create(match: CreateMatchDTO): Promise<MatchInterface> {
    const { data } = await ApiClient.instance.post<MatchInterface>(MatchService.API_URL, match);
    return data;
  }

  public static async update(id: number, match: UpdateMatchDTO): Promise<MatchInterface> {
    const { data } = await ApiClient.instance.patch<MatchInterface>(
      `${MatchService.API_URL}/${id}`,
      match,
    );
    return data;
  }

  public static async delete(id: number): Promise<void> {
    await ApiClient.instance.delete(`${MatchService.API_URL}/${id}`);
  }
}
