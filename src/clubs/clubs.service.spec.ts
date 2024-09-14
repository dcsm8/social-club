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
      // Given
      const expectedClubs = [new Club()];
      jest.spyOn(repo, 'find').mockResolvedValue(expectedClubs);

      // When
      const result = await service.findAll();

      // Then
      expect(result).toBe(expectedClubs);
    });
  });

  describe('findOne', () => {
    it('should return a club when it exists', async () => {
      // Given
      const clubId = '1';
      const expectedClub = new Club();
      jest.spyOn(repo, 'findOne').mockResolvedValue(expectedClub);

      // When
      const result = await service.findOne(clubId);

      // Then
      expect(result).toBe(expectedClub);
    });

    it('should throw NotFoundException when club does not exist', async () => {
      // Given
      const clubId = '1';
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.findOne(clubId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully create a club', async () => {
      // Given
      const newClub = new Club();
      const clubData = {
        name: 'Test Club',
        foundationDate: new Date(),
        image: 'test.jpg',
        description: 'Test Description',
      };
      jest.spyOn(repo, 'create').mockReturnValue(newClub);
      jest.spyOn(repo, 'save').mockResolvedValue(newClub);

      // When
      const result = await service.create(clubData);

      // Then
      expect(result).toBe(newClub);
      expect(repo.create).toHaveBeenCalledWith(clubData);
      expect(repo.save).toHaveBeenCalledWith(newClub);
    });
  });

  describe('update', () => {
    it('should successfully update a club', async () => {
      // Given
      const clubId = '1';
      const existingClub = new Club();
      const updatedClub = { ...existingClub, name: 'Updated Club' };
      const updateData = { name: 'Updated Club' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(existingClub);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedClub);

      // When
      const result = await service.update(clubId, updateData as any);

      // Then
      expect(result.name).toBe('Updated Club');
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: clubId } });
      expect(repo.save).toHaveBeenCalledWith({
        ...existingClub,
        ...updateData,
      });
    });

    it('should throw NotFoundException when club to update does not exist', async () => {
      // Given
      const clubId = '1';
      const updateData = { name: 'Updated Club' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      // When & Then
      await expect(service.update(clubId, updateData as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should successfully delete a club', async () => {
      // Given
      const clubId = '1';
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1, raw: [] });

      // When & Then
      await expect(service.delete(clubId)).resolves.not.toThrow();
      expect(repo.delete).toHaveBeenCalledWith(clubId);
    });

    it('should throw NotFoundException when club to delete does not exist', async () => {
      // Given
      const clubId = '1';
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      // When & Then
      await expect(service.delete(clubId)).rejects.toThrow(NotFoundException);
    });
  });
});
