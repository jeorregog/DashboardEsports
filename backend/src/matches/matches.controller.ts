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
import { CreateMatchDto } from './dto/create-match.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Match } from './entities/match.entity.js';
import { MatchesService } from './matches.service.js';
import { UpdateMatchDto } from './dto/update-match.dto.js';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(): Promise<Match[]> {
    return this.matchesService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getById(@Param('id') id: string): Promise<Match | null> {
    return this.matchesService.getById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchesService.create(createMatchDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    return this.matchesService.update(Number(id), updateMatchDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id') id: string): Promise<void> {
    return this.matchesService.delete(Number(id));
  }
}
