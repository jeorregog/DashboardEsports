// external imports
import axios from 'axios';

// internal imports
import type { CreatePlayerDTO, UpdatePlayerDTO } from '@/dtos/PlayerDTOS.js';
import type { PlayerInterface } from '@/interfaces/PlayerInterface.js';

export class PlayerService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/players`;

  public static async getAll(): Promise<PlayerInterface[]> {
    const { data } = await axios.get(this.API_URL);
    return data;
  }

  public static async getById(id: number): Promise<PlayerInterface> {
    const { data } = await axios.get(`${this.API_URL}/${id}`);
    return data;
  }

  public static async create(player: CreatePlayerDTO): Promise<PlayerInterface> {
    const { data } = await axios.post(this.API_URL, player);
    return data;
  }

  public static async update(id: number, player: UpdatePlayerDTO): Promise<PlayerInterface> {
    const { data } = await axios.patch(`${this.API_URL}/${id}`, player);
    return data;
  }

  public static async delete(id: number): Promise<void> {
    await axios.delete(`${this.API_URL}/${id}`);
  }
}
