import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ClubMembersService } from './club-members.service';
import { Member } from '../members/entities/member.entity';
import { Club } from '../clubs/entities/club.entity';

@Controller('clubs/:clubId/members')
export class ClubMembersController {
  constructor(private readonly clubMembersService: ClubMembersService) {}

  @Post(':memberId')
  async addMemberToClub(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ): Promise<Club> {
    return this.clubMembersService.addMemberToClub(clubId, memberId);
  }

  @Get()
  async findMembersFromClub(
    @Param('clubId') clubId: string,
  ): Promise<Member[]> {
    return this.clubMembersService.findMembersFromClub(clubId);
  }

  @Get(':memberId')
  async findMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ): Promise<Member> {
    return this.clubMembersService.findMemberFromClub(clubId, memberId);
  }

  @Put()
  async updateMembersFromClub(
    @Param('clubId') clubId: string,
    @Body() memberIds: string[],
  ): Promise<Club> {
    return this.clubMembersService.updateMembersFromClub(clubId, memberIds);
  }

  @Delete(':memberId')
  @HttpCode(204)
  async deleteMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ): Promise<Club> {
    return this.clubMembersService.deleteMemberFromClub(clubId, memberId);
  }
}
