import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/db/client';
import * as cookbookService from '@/backend/services/cookbook.service';

vi.mock('@/backend/db/client', () => ({
  prisma: {
    cookbook: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    recipe: {
      findFirst: vi.fn(),
      update: vi.fn(),
    }
  }
}));

describe('Cookbook Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUserId = 'user_123';
  const mockCookbookId = 'cookbook_1';
  const mockRecipeId = 'recipe_1';

  describe('getCookbooksByUser', () => {
    it('should return cookbooks for a user', async () => {
      const mockCookbooks = [{ id: mockCookbookId, title: 'My Cookbook' }];
      vi.mocked(prisma.cookbook.findMany).mockResolvedValueOnce(mockCookbooks as any);

      const result = await cookbookService.getCookbooksByUser(mockUserId);
      
      expect(prisma.cookbook.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { recipes: true }
          }
        }
      });
      expect(result).toEqual(mockCookbooks);
    });
  });

  describe('getCookbookById', () => {
    it('should return a cookbook by id including recipes', async () => {
      const mockCookbook = { id: mockCookbookId, title: 'My Cookbook', recipes: [] };
      vi.mocked(prisma.cookbook.findFirst).mockResolvedValueOnce(mockCookbook as any);

      const result = await cookbookService.getCookbookById(mockCookbookId, mockUserId);
      
      expect(prisma.cookbook.findFirst).toHaveBeenCalledWith({
        where: { id: mockCookbookId, userId: mockUserId },
        include: { recipes: true },
      });
      expect(result).toEqual(mockCookbook);
    });
  });

  describe('createCookbook', () => {
    it('should create a cookbook', async () => {
      const mockData = { title: 'New Cookbook', description: 'Desc' };
      const mockCreated = { id: mockCookbookId, ...mockData, userId: mockUserId };
      vi.mocked(prisma.cookbook.create).mockResolvedValueOnce(mockCreated as any);

      const result = await cookbookService.createCookbook(mockUserId, mockData);

      expect(prisma.cookbook.create).toHaveBeenCalledWith({
        data: {
          ...mockData,
          userId: mockUserId,
        }
      });
      expect(result).toEqual(mockCreated);
    });
  });

  describe('updateCookbook', () => {
    it('should update a cookbook if user owns it', async () => {
      const mockData = { title: 'Updated Title' };
      const mockCookbook = { id: mockCookbookId, userId: mockUserId };
      
      vi.mocked(prisma.cookbook.findFirst).mockResolvedValueOnce(mockCookbook as any);
      vi.mocked(prisma.cookbook.update).mockResolvedValueOnce({ ...mockCookbook, ...mockData } as any);

      const result = await cookbookService.updateCookbook(mockCookbookId, mockUserId, mockData);

      expect(prisma.cookbook.findFirst).toHaveBeenCalledWith({ where: { id: mockCookbookId, userId: mockUserId } });
      expect(prisma.cookbook.update).toHaveBeenCalledWith({
        where: { id: mockCookbookId },
        data: mockData
      });
      expect(result).toEqual({ ...mockCookbook, ...mockData });
    });

    it('should return null if user does not own cookbook', async () => {
      vi.mocked(prisma.cookbook.findFirst).mockResolvedValueOnce(null);

      const result = await cookbookService.updateCookbook(mockCookbookId, mockUserId, { title: 'Updated Title' });

      expect(prisma.cookbook.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('deleteCookbook', () => {
    it('should delete a cookbook if user owns it', async () => {
      const mockCookbook = { id: mockCookbookId, userId: mockUserId };
      vi.mocked(prisma.cookbook.findFirst).mockResolvedValueOnce(mockCookbook as any);
      vi.mocked(prisma.cookbook.delete).mockResolvedValueOnce(mockCookbook as any);

      const result = await cookbookService.deleteCookbook(mockCookbookId, mockUserId);

      expect(prisma.cookbook.findFirst).toHaveBeenCalledWith({ where: { id: mockCookbookId, userId: mockUserId } });
      expect(prisma.cookbook.delete).toHaveBeenCalledWith({ where: { id: mockCookbookId } });
      expect(result).toEqual(mockCookbook);
    });

    it('should return null if user does not own cookbook', async () => {
      vi.mocked(prisma.cookbook.findFirst).mockResolvedValueOnce(null);

      const result = await cookbookService.deleteCookbook(mockCookbookId, mockUserId);

      expect(prisma.cookbook.delete).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('addRecipeToCookbook', () => {
    it('should add recipe to cookbook if user owns both', async () => {
      const mockCookbook = { id: mockCookbookId, userId: mockUserId };
      const mockRecipe = { id: mockRecipeId, userId: mockUserId };
      
      vi.mocked(prisma.cookbook.findFirst).mockResolvedValueOnce(mockCookbook as any);
      vi.mocked(prisma.recipe.findFirst).mockResolvedValueOnce(mockRecipe as any);
      vi.mocked(prisma.recipe.update).mockResolvedValueOnce({ ...mockRecipe, cookbookId: mockCookbookId } as any);

      const result = await cookbookService.addRecipeToCookbook(mockCookbookId, mockRecipeId, mockUserId);

      expect(prisma.cookbook.findFirst).toHaveBeenCalledWith({ where: { id: mockCookbookId, userId: mockUserId } });
      expect(prisma.recipe.findFirst).toHaveBeenCalledWith({ where: { id: mockRecipeId, userId: mockUserId } });
      expect(prisma.recipe.update).toHaveBeenCalledWith({
        where: { id: mockRecipeId },
        data: { cookbookId: mockCookbookId }
      });
      expect(result).toEqual({ ...mockRecipe, cookbookId: mockCookbookId });
    });

    it('should return null if user does not own cookbook or recipe', async () => {
      vi.mocked(prisma.cookbook.findFirst).mockResolvedValueOnce(null);
      vi.mocked(prisma.recipe.findFirst).mockResolvedValueOnce({ id: mockRecipeId } as any);

      const result = await cookbookService.addRecipeToCookbook(mockCookbookId, mockRecipeId, mockUserId);

      expect(prisma.recipe.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('removeRecipeFromCookbook', () => {
    it('should remove recipe from cookbook if user owns it and it belongs to cookbook', async () => {
      const mockRecipe = { id: mockRecipeId, userId: mockUserId, cookbookId: mockCookbookId };
      
      vi.mocked(prisma.recipe.findFirst).mockResolvedValueOnce(mockRecipe as any);
      vi.mocked(prisma.recipe.update).mockResolvedValueOnce({ ...mockRecipe, cookbookId: null } as any);

      const result = await cookbookService.removeRecipeFromCookbook(mockCookbookId, mockRecipeId, mockUserId);

      expect(prisma.recipe.findFirst).toHaveBeenCalledWith({
        where: { id: mockRecipeId, userId: mockUserId, cookbookId: mockCookbookId }
      });
      expect(prisma.recipe.update).toHaveBeenCalledWith({
        where: { id: mockRecipeId },
        data: { cookbookId: null }
      });
      expect(result).toEqual({ ...mockRecipe, cookbookId: null });
    });

    it('should return null if recipe not found or does not belong to cookbook', async () => {
      vi.mocked(prisma.recipe.findFirst).mockResolvedValueOnce(null);

      const result = await cookbookService.removeRecipeFromCookbook(mockCookbookId, mockRecipeId, mockUserId);

      expect(prisma.recipe.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
