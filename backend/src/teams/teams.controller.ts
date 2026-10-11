// external imports
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

// internal imports
import { AdminGuard } from '../auth/guards/admin.guard.js';
import { CreateTeamDto, UpdateTeamDto } from './dto/TeamDTOS.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Team } from './entities/team.entity.js';
import { TeamsService } from './teams.service.js';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(): Promise<Team[]> {
    return this.teamsService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getById(@Param('id') id: string): Promise<Team | null> {
    return this.teamsService.getById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamsService.update(Number(id), updateTeamDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id') id: string): Promise<void> {
    return this.teamsService.delete(Number(id));
  }
}
