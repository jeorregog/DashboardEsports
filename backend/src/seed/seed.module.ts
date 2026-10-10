// external imports
import { Module } from '@nestjs/common';

// internal imports
import { SeedService } from './seed.service.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule],
  providers: [SeedService],
})
export class SeedModule {}
