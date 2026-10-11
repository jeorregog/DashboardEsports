// external imports
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

// internal imports
import { Team } from '../../teams/entities/team.entity.js';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  wins: number;

  @Column()
  earnings: number;

  @Column()
  role: string;

  @Column()
  country: string;

  @ManyToOne(() => Team, (team) => team.players, { nullable: true })
  team: Relation<Team> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
