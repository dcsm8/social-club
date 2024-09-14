import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { CreateClubDto } from './dto/create-club.dto';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
  ) {}

  async findAll(): Promise<Club[]> {
    return this.clubsRepository.find();
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.clubsRepository.findOne({ where: { id } });
    if (!club) {
      throw new NotFoundException(`Club with ID "${id}" not found`);
    }
    return club;
  }

  async create(createClubDto: CreateClubDto): Promise<Club> {
    const club = this.clubsRepository.create(createClubDto);
    return this.clubsRepository.save(club);
  }

  async update(id: string, updateClubDto: CreateClubDto): Promise<Club> {
    const club = await this.findOne(id);
    Object.assign(club, updateClubDto);
    return this.clubsRepository.save(club);
  }

  async delete(id: string): Promise<void> {
    const result = await this.clubsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Club with ID "${id}" not found`);
    }
  }
}
