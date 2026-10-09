// external imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreatePlayerDto } from './dto/create-player.dto.js';
import { Player } from './entities/player.entity.js';
import { UpdatePlayerDto } from './dto/update-player.dto.js';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  findOne(id: number): Promise<Player | null> {
    return this.playersRepository.findOneBy({ id });
  }

  create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playersRepository.create(createPlayerDto);
    return this.playersRepository.save(player);
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.playersRepository.findOneBy({ id });
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
    this.playersRepository.merge(player, updatePlayerDto);
    return this.playersRepository.save(player);
  }

  async remove(id: number): Promise<void> {
    const result = await this.playersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
  }
}
