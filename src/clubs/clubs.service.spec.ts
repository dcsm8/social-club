import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubsService } from './clubs.service';
import { Club } from './entities/club.entity';
import { NotFoundException } from '@nestjs/common';

describe('ClubsService', () => {
  let service: ClubsService;
  let repo: Repository<Club>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        {
          provide: getRepositoryToken(Club),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
    repo = module.get<Repository<Club>>(getRepositoryToken(Club));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of clubs', async () => {
      const result = [new Club()];
      jest.spyOn(repo, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a club', async () => {
      const result = new Club();
      jest.spyOn(repo, 'findOne').mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
    });

    it('should throw NotFoundException if club is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully create a club', async () => {
      const club = new Club();
      jest.spyOn(repo, 'create').mockReturnValue(club);
      jest.spyOn(repo, 'save').mockResolvedValue(club);

      expect(
        await service.create({
          name: 'Test Club',
          foundationDate: new Date(),
          image: 'test.jpg',
          description: 'Test Description',
        }),
      ).toBe(club);
    });
  });

  describe('update', () => {
    it('should successfully update a club', async () => {
      const club = new Club();
      jest.spyOn(repo, 'findOne').mockResolvedValue(club);
      jest
        .spyOn(repo, 'save')
        .mockResolvedValue({ ...club, name: 'Updated Club' });

      const result = await service.update('1', { name: 'Updated Club' } as any);
      expect(result.name).toBe('Updated Club');
    });

    it('should throw NotFoundException if club to update is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should successfully delete a club', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1, raw: [] });

      await expect(service.delete('1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if club to delete is not found', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
