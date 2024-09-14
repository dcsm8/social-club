import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubMembersService } from './club-members.service';
import { Club } from '../clubs/entities/club.entity';
import { Member } from '../members/entities/member.entity';
import { NotFoundException } from '@nestjs/common';

describe('ClubMembersService', () => {
  let service: ClubMembersService;
  let clubsRepository: Repository<Club>;
  let membersRepository: Repository<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubMembersService,
        {
          provide: getRepositoryToken(Club),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Member),
          useValue: {
            findOne: jest.fn(),
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClubMembersService>(ClubMembersService);
    clubsRepository = module.get(getRepositoryToken(Club)) as jest.Mocked<
      Repository<Club>
    >;
    membersRepository = module.get(getRepositoryToken(Member)) as jest.Mocked<
      Repository<Member>
    >;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addMemberToClub', () => {
    it('should add a member to a club', async () => {
      // Given
      const clubId = '1';
      const memberId = '2';
      const club = { id: clubId, members: [] } as Club;
      const member = { id: memberId } as Member;

      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(club);
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest
        .spyOn(clubsRepository, 'save')
        .mockResolvedValue({ ...club, members: [member] } as Club);

      // When
      const result = await service.addMemberToClub(clubId, memberId);

      // Then
      expect(result.members).toContain(member);
      expect(clubsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: clubId,
          members: [member],
        }),
      );
    });

    it('should throw NotFoundException if club is not found', async () => {
      // Given
      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.addMemberToClub('1', '2')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if member is not found', async () => {
      // Given
      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue({} as Club);
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.addMemberToClub('1', '2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMembersFromClub', () => {
    it('should return members of a club', async () => {
      // Given
      const clubId = '1';
      const members = [{ id: '2' }, { id: '3' }] as Member[];
      const club = { id: clubId, members } as Club;

      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(club);

      // When
      const result = await service.findMembersFromClub(clubId);

      // Then
      expect(result).toEqual(members);
    });

    it('should throw NotFoundException if club is not found', async () => {
      // Given
      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.findMembersFromClub('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMemberFromClub', () => {
    it('should return a specific member from a club', async () => {
      // Given
      const clubId = '1';
      const memberId = '2';
      const member = { id: memberId } as Member;
      const club = { id: clubId, members: [member] } as Club;

      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(club);

      // When
      const result = await service.findMemberFromClub(clubId, memberId);

      // Then
      expect(result).toEqual(member);
    });

    it('should throw NotFoundException if club is not found', async () => {
      // Given
      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.findMemberFromClub('1', '2')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if member is not found in club', async () => {
      // Given
      const club = { id: '1', members: [] } as Club;
      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(club);

      // When & Then
      await expect(service.findMemberFromClub('1', '2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateMembersFromClub', () => {
    it('should update members of a club', async () => {
      // Given
      const clubId = '1';
      const memberIds = ['2', '3'];
      const club = { id: clubId, members: [] } as Club;
      const members = memberIds.map((id) => ({ id }) as Member);

      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(club);
      jest.spyOn(membersRepository, 'findByIds').mockResolvedValue(members);
      jest
        .spyOn(clubsRepository, 'save')
        .mockResolvedValue({ ...club, members } as Club);

      // When
      const result = await service.updateMembersFromClub(clubId, memberIds);

      // Then
      expect(result.members).toEqual(members);
      expect(clubsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: clubId,
          members,
        }),
      );
    });

    it('should throw NotFoundException if club is not found', async () => {
      // Given
      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(
        service.updateMembersFromClub('1', ['2', '3']),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if any member is not found', async () => {
      // Given
      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue({} as Club);
      jest
        .spyOn(membersRepository, 'findByIds')
        .mockResolvedValue([{ id: '2' }] as Member[]);

      // When & Then
      await expect(
        service.updateMembersFromClub('1', ['2', '3']),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMemberFromClub', () => {
    it('should delete a member from a club', async () => {
      // Given
      const clubId = '1';
      const memberId = '2';
      const member1 = { id: memberId } as Member;
      const member2 = { id: '3' } as Member;
      const club = { id: clubId, members: [member1, member2] } as Club;

      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(club);
      jest
        .spyOn(clubsRepository, 'save')
        .mockResolvedValue({ ...club, members: [member2] } as Club);

      // When
      const result = await service.deleteMemberFromClub(clubId, memberId);

      // Then
      expect(result.members).not.toContainEqual(member1);
      expect(result.members).toContainEqual(member2);
      expect(clubsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: clubId,
          members: [member2],
        }),
      );
    });

    it('should throw NotFoundException if club is not found', async () => {
      // Given
      jest.spyOn(clubsRepository, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.deleteMemberFromClub('1', '2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
