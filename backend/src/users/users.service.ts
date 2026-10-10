// external imports
import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

const SALT_ROUNDS = 10;

export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.stripPassword(user));
  }

  async findOne(id: number): Promise<SafeUser | null> {
    const user = await this.usersRepository.findOneBy({ id });
    return user ? this.stripPassword(user) : null;
  }

  // Returns the full entity including the password hash for internal auth use only.
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, SALT_ROUNDS),
      isAdmin: createUserDto.isAdmin ?? false,
    });
    const saved = await this.usersRepository.save(user);
    return this.stripPassword(saved);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...rest } = updateUserDto;
    this.usersRepository.merge(user, rest);
    if (password !== undefined) {
      user.password = await bcrypt.hash(password, SALT_ROUNDS);
    }
    const saved = await this.usersRepository.save(user);
    return this.stripPassword(saved);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private stripPassword(user: User): SafeUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
