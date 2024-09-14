import { Club } from 'src/clubs/entities/club.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

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
