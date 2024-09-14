import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  foundationDate: Date;

  @Column()
  image: string;

  @Column({ length: 100 })
  description: string;

  @ManyToMany(() => Member, (member) => member.clubs)
  @JoinTable()
  members: Member[];
}
