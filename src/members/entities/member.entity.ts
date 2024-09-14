import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  birthDate: Date;

  @ManyToMany(() => Club, (club) => club.members)
  clubs: Club[];
}
