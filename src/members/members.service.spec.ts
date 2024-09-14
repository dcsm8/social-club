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
      const result = [new Member()];
      jest.spyOn(repo, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a member', async () => {
      const result = new Member();
      jest.spyOn(repo, 'findOne').mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
    });

    it('should throw NotFoundException if member is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully create a member', async () => {
      const member = new Member();
      jest.spyOn(repo, 'create').mockReturnValue(member);
      jest.spyOn(repo, 'save').mockResolvedValue(member);

      expect(
        await service.create({
          username: 'testuser',
          email: 'test@example.com',
          birthDate: new Date(),
        }),
      ).toBe(member);
    });
  });

  describe('update', () => {
    it('should successfully update a member', async () => {
      const member = new Member();
      jest.spyOn(repo, 'findOne').mockResolvedValue(member);
      jest
        .spyOn(repo, 'save')
        .mockResolvedValue({ ...member, username: 'updateduser' });

      const result = await service.update('1', {
        username: 'updateduser',
      } as any);
      expect(result.username).toBe('updateduser');
    });

    it('should throw NotFoundException if member to update is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should successfully delete a member', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1, raw: [] });

      await expect(service.delete('1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if member to delete is not found', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
