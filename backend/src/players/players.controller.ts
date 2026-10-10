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
import { CreatePlayerDto } from './dto/create-player.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Player } from './entities/player.entity.js';
import { PlayersService } from './players.service.js';
import { UpdatePlayerDto } from './dto/update-player.dto.js';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<Player[]> {
    return this.playersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Player | null> {
    return this.playersService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersService.create(createPlayerDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return this.playersService.update(Number(id), updatePlayerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.playersService.remove(Number(id));
  }
}
