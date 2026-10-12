// internal imports
import { ApiClient } from '@/services/ApiClient.js';
import type { CreateUserDTO, UpdateUserDTO } from '@/dtos/UserDTOS.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';

export class UserService {
  private static readonly API_URL = '/api/users';

  public static async getAll(): Promise<UserInterface[]> {
    const { data } = await ApiClient.instance.get<UserInterface[]>(UserService.API_URL);
    return data;
  }

  public static async getById(id: number): Promise<UserInterface> {
    const { data } = await ApiClient.instance.get<UserInterface>(`${UserService.API_URL}/${id}`);
    return data;
  }

  public static async create(user: CreateUserDTO): Promise<UserInterface> {
    const { data } = await ApiClient.instance.post<UserInterface>(UserService.API_URL, user);
    return data;
  }

  public static async update(id: number, user: UpdateUserDTO): Promise<UserInterface> {
    const { data } = await ApiClient.instance.patch<UserInterface>(
      `${UserService.API_URL}/${id}`,
      user,
    );
    return data;
  }

  public static async delete(id: number): Promise<void> {
    await ApiClient.instance.delete(`${UserService.API_URL}/${id}`);
  }
}
