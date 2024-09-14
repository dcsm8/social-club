import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { NotFoundException } from '@nestjs/common';

describe('MembersService', () => {
  let service: MembersService;
  let repo: Repository<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    repo = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      // Given
      const expectedMembers = [new Member()];
      jest.spyOn(repo, 'find').mockResolvedValue(expectedMembers);

      // When
      const result = await service.findAll();

      // Then
      expect(result).toBe(expectedMembers);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a member when it exists', async () => {
      // Given
      const memberId = '1';
      const expectedMember = new Member();
      jest.spyOn(repo, 'findOne').mockResolvedValue(expectedMember);

      // When
      const result = await service.findOne(memberId);

      // Then
      expect(result).toBe(expectedMember);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: memberId } });
    });

    it('should throw NotFoundException when member does not exist', async () => {
      // Given
      const memberId = '1';
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.findOne(memberId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: memberId } });
    });
  });

  describe('create', () => {
    it('should successfully create a member', async () => {
      // Given
      const newMember = new Member();
      const memberData = {
        username: 'testuser',
        email: 'test@example.com',
        birthDate: new Date(),
      };
      jest.spyOn(repo, 'create').mockReturnValue(newMember);
      jest.spyOn(repo, 'save').mockResolvedValue(newMember);

      // When
      const result = await service.create(memberData);

      // Then
      expect(result).toBe(newMember);
      expect(repo.create).toHaveBeenCalledWith(memberData);
      expect(repo.save).toHaveBeenCalledWith(newMember);
    });
  });

  describe('update', () => {
    it('should successfully update a member', async () => {
      // Given
      const memberId = '1';
      const existingMember = new Member();
      const updatedMember = { ...existingMember, username: 'updateduser' };
      const updateData = { username: 'updateduser' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(existingMember);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedMember);

      // When
      const result = await service.update(memberId, updateData as any);

      // Then
      expect(result.username).toBe('updateduser');
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: memberId } });
      expect(repo.save).toHaveBeenCalledWith({
        ...existingMember,
        ...updateData,
      });
    });

    it('should throw NotFoundException when member to update does not exist', async () => {
      // Given
      const memberId = '1';
      const updateData = { username: 'updateduser' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.update(memberId, updateData as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: memberId } });
    });
  });

  describe('delete', () => {
    it('should successfully delete a member', async () => {
      // Given
      const memberId = '1';
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1, raw: [] });

      // When & Then
      await expect(service.delete(memberId)).resolves.not.toThrow();
      expect(repo.delete).toHaveBeenCalledWith(memberId);
    });

    it('should throw NotFoundException when member to delete does not exist', async () => {
      // Given
      const memberId = '1';
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      // When & Then
      await expect(service.delete(memberId)).rejects.toThrow(NotFoundException);
      expect(repo.delete).toHaveBeenCalledWith(memberId);
    });
  });
});
