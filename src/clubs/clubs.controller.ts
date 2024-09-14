import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { Club } from './entities/club.entity';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  async findAll(): Promise<Club[]> {
    return this.clubsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Club> {
    const club = await this.clubsService.findOne(id);
    if (!club) {
      throw new NotFoundException(`Club with ID "${id}" not found`);
    }
    return club;
  }

  @Post()
  async create(@Body() createClubDto: CreateClubDto): Promise<Club> {
    return this.clubsService.create(createClubDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClubDto: CreateClubDto,
  ): Promise<Club> {
    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return this.clubsService.delete(id);
  }
}
