// external imports
import { Injectable, OnModuleInit } from '@nestjs/common';

// internal imports
import { UsersService } from '../users/users.service.js';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit(): Promise<void> {
    const email = process.env.ADMIN_EMAIL ?? 'admin@dashboard.com';
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      return;
    }
    await this.usersService.create({
      username: process.env.ADMIN_USERNAME ?? 'admin',
      email,
      password: process.env.ADMIN_PASSWORD ?? 'admin123',
      isAdmin: true,
    });
  }
}
