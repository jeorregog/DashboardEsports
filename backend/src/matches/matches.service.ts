// external imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreateMatchDto, UpdateMatchDto } from './dto/MatchDTOS.js';
import { Match } from './entities/match.entity.js';
import { Team } from '../teams/entities/team.entity.js';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  getAll(): Promise<Match[]> {
    return this.matchesRepository.find({
      relations: { team1: true, team2: true, winner: true },
    });
  }

  getById(id: number): Promise<Match | null> {
    return this.matchesRepository.findOne({
      where: { id },
      relations: { team1: true, team2: true, winner: true },
    });
  }

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const { date, game, team1Id, team2Id, winnerId } = createMatchDto;
    const match = this.matchesRepository.create({
      game,
      date: new Date(date),
      team1: await this.getTeam(team1Id),
      team2: await this.getTeam(team2Id),
      winner: await this.getTeam(winnerId),
    });
    return this.matchesRepository.save(match);
  }

  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.matchesRepository.findOneBy({ id });
    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    const { date, game, team1Id, team2Id, winnerId } = updateMatchDto;
    if (game !== undefined) {
      match.game = game;
    }
    if (date !== undefined) {
      match.date = new Date(date);
    }
    if (team1Id !== undefined) {
      match.team1 = await this.getTeam(team1Id);
    }
    if (team2Id !== undefined) {
      match.team2 = await this.getTeam(team2Id);
    }
    if (winnerId !== undefined) {
      match.winner = await this.getTeam(winnerId);
    }
    return this.matchesRepository.save(match);
  }

  async delete(id: number): Promise<void> {
    const result = await this.matchesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }
  }

  private async getTeam(id: number): Promise<Team> {
    const team = await this.teamsRepository.findOneBy({ id });
    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return team;
  }
}
