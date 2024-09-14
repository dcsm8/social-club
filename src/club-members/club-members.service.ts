import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../clubs/entities/club.entity';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class ClubMembersService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async addMemberToClub(clubId: string, memberId: string): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    const member = await this.membersRepository.findOne({
      where: { id: memberId },
    });

    if (!club)
      throw new NotFoundException(`Club with ID "${clubId}" not found`);
    if (!member)
      throw new NotFoundException(`Member with ID "${memberId}" not found`);

    club.members.push(member);
    return this.clubsRepository.save(club);
  }

  async findMembersFromClub(clubId: string): Promise<Member[]> {
    const club = await this.clubsRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    if (!club)
      throw new NotFoundException(`Club with ID "${clubId}" not found`);
    return club.members;
  }

  async findMemberFromClub(clubId: string, memberId: string): Promise<Member> {
    const club = await this.clubsRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    if (!club)
      throw new NotFoundException(`Club with ID "${clubId}" not found`);

    const member = club.members.find((m) => m.id === memberId);
    if (!member)
      throw new NotFoundException(
        `Member with ID "${memberId}" not found in club "${clubId}"`,
      );

    return member;
  }

  async updateMembersFromClub(
    clubId: string,
    memberIds: string[],
  ): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    if (!club)
      throw new NotFoundException(`Club with ID "${clubId}" not found`);

    const members = await this.membersRepository.findByIds(memberIds);
    if (members.length !== memberIds.length) {
      throw new NotFoundException('One or more members not found');
    }

    club.members = members;
    return this.clubsRepository.save(club);
  }

  async deleteMemberFromClub(clubId: string, memberId: string): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    if (!club)
      throw new NotFoundException(`Club with ID "${clubId}" not found`);

    club.members = club.members.filter((member) => member.id !== memberId);
    return this.clubsRepository.save(club);
  }
}
