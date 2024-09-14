import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubMembersService } from './club-members.service';
import { ClubMembersController } from './club-members.controller';
import { Club } from '../clubs/entities/club.entity';
import { Member } from '../members/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Club, Member])],
  providers: [ClubMembersService],
  controllers: [ClubMembersController],
})
export class ClubMembersModule {}
