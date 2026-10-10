// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { AuthModule } from './auth/auth.module.js';
import { HomeModule } from './home/home.module.js';
import { PlayersModule } from './players/players.module.js';
import { SeedModule } from './seed/seed.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.SQLITE_PATH ?? 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    HomeModule,
    PlayersModule,
    SeedModule,
    UsersModule,
  ],
})
export class AppModule {}
