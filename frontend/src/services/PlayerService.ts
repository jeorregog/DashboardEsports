import type { CreatePlayerDTO } from '@/dtos/CreatePlayerDTO.js';
import type { UpdatePlayerDTO } from '@/dtos/UpdatePlayerDTO.js';
import type { PlayerInterface } from '@/interfaces/PlayerInterface.js';
import axios from 'axios';

export class PlayerService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/players`;

  public static async getPlayers(): Promise<PlayerInterface[]> {
    const { data } = await axios.get(this.API_URL);
    return data;
  }

  public static async getPlayerById(id: number): Promise<PlayerInterface> {
    const { data } = await axios.get(`${this.API_URL}/${id}`);
    return data;
  }

  public static async createPlayer(player: CreatePlayerDTO): Promise<PlayerInterface> {
    const { data } = await axios.post(this.API_URL, player);
    return data;
  }

  public static async updatePlayer(id: number, player: UpdatePlayerDTO): Promise<PlayerInterface> {
    const { data } = await axios.patch(`${this.API_URL}/${id}`, player);
    return data;
  }

  public static async deletePlayer(id: number): Promise<void> {
    await axios.delete(`${this.API_URL}/${id}`);
  }
}
