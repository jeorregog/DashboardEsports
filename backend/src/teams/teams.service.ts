// external imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreateTeamDto } from './dto/create-team.dto.js';
import { Team } from './entities/team.entity.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  getAll(): Promise<Team[]> {
    return this.teamsRepository.find({ relations: { players: true } });
  }

  getById(id: number): Promise<Team | null> {
    return this.teamsRepository.findOne({
      where: { id },
      relations: { players: true },
    });
  }

  create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamsRepository.create(createTeamDto);
    return this.teamsRepository.save(team);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamsRepository.findOneBy({ id });
    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    this.teamsRepository.merge(team, updateTeamDto);
    return this.teamsRepository.save(team);
  }

  async delete(id: number): Promise<void> {
    const result = await this.teamsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
  }
}
