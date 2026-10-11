// external imports
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';

// internal imports
import { Team } from '../../teams/entities/team.entity.js';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  game: string;

  @Column({ type: 'datetime' })
  date: Date;

  @ManyToOne(() => Team, { nullable: false })
  team1: Relation<Team>;

  @ManyToOne(() => Team, { nullable: false })
  team2: Relation<Team>;

  @ManyToOne(() => Team, { nullable: false })
  winner: Relation<Team>;
}
