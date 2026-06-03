import { Test, TestingModule } from '@nestjs/testing';
import { MealsService } from './meals.service';

// ── OpenAI Mock ───────────────────────────────────────────────────────────────

jest.mock('src/openai', () => ({
  analyzeFoodImage: jest.fn(),
  analyzeFoodText: jest.fn(),
}));

import { analyzeFoodImage, analyzeFoodText } from 'src/openai';

// ── Prisma Mock ───────────────────────────────────────────────────────────────

const prismaMock = {
  meals: {
    create: jest.fn(),
    deleteMany: jest.fn(),
    updateMany: jest.fn(),
    findMany: jest.fn(),
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MealsService', () => {
  let service: MealsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealsService, { provide: 'PRISMA_USER', useValue: prismaMock }],
    }).compile();

    service = module.get<MealsService>(MealsService);
    jest.clearAllMocks();
  });

  // ── createMeal ─────────────────────────────────────────────────────────────

  describe('createMeal', () => {
    it('should create a meal and return success message', async () => {
      prismaMock.meals.create.mockResolvedValue({});
      const dto = {
        name: 'Oatmeal',
        mealtype: 'breakfast',
        calories: 300,
        carbs: 50,
        protein: 10,
        fats: 5,
      } as any;

      const result = await service.createMeal(1, dto);

      expect(prismaMock.meals.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ user_id: 1, name: 'Oatmeal' }) })
      );
      expect(result).toEqual({ message: 'Meal created successfully' });
    });

    it('should use provided date if given', async () => {
      prismaMock.meals.create.mockResolvedValue({});
      const dto = {
        name: 'Oatmeal',
        mealtype: 'breakfast',
        calories: 300,
        date: '2026-06-03',
      } as any;

      await service.createMeal(1, dto);

      expect(prismaMock.meals.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ date: new Date('2026-06-03') }) })
      );
    });
  });

  // ── deleteMeal ─────────────────────────────────────────────────────────────

  describe('deleteMeal', () => {
    it('should delete a meal and return success message', async () => {
      prismaMock.meals.deleteMany.mockResolvedValue({});

      const result = await service.deleteMeal(1, 42);

      expect(prismaMock.meals.deleteMany).toHaveBeenCalledWith({
        where: { id: 42, user_id: 1 },
      });
      expect(result).toEqual({ message: 'Meal deleted successfully' });
    });
  });

  // ── editMeal ───────────────────────────────────────────────────────────────

  describe('editMeal', () => {
    it('should update a meal and return success message', async () => {
      prismaMock.meals.updateMany.mockResolvedValue({});
      const dto = {
        mealId: 5,
        name: 'Updated',
        calories: 400,
        carbs: 60,
        protein: 15,
        fats: 8,
      } as any;

      const result = await service.editMeal(dto, 1);

      expect(prismaMock.meals.updateMany).toHaveBeenCalledWith({
        where: { id: 5, user_id: 1 },
        data: expect.objectContaining({ name: 'Updated', calories: 400 }),
      });
      expect(result).toEqual({ message: 'Meal updated successfully' });
    });
  });

  // ── getBreakfast / getLunch / getDinner / getSnack ─────────────────────────

  describe('getBreakfast', () => {
    it('should return breakfast meals for a user', async () => {
      const meals = [{ id: 1, mealtype: 'breakfast' }];
      prismaMock.meals.findMany.mockResolvedValue(meals);

      const result = await service.getBreakfast(1, '2026-06-03');

      expect(prismaMock.meals.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ user_id: 1, mealtype: 'breakfast' }),
        })
      );
      expect(result).toEqual(meals);
    });
  });

  describe('getLunch', () => {
    it('should return lunch meals for a user', async () => {
      prismaMock.meals.findMany.mockResolvedValue([]);

      await service.getLunch(1, '2026-06-03');

      expect(prismaMock.meals.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ mealtype: 'lunch' }) })
      );
    });
  });

  describe('getDinner', () => {
    it('should return dinner meals for a user', async () => {
      prismaMock.meals.findMany.mockResolvedValue([]);

      await service.getDinner(1, '2026-06-03');

      expect(prismaMock.meals.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ mealtype: 'dinner' }) })
      );
    });
  });

  describe('getSnack', () => {
    it('should return snack meals for a user', async () => {
      prismaMock.meals.findMany.mockResolvedValue([]);

      await service.getSnack(1, '2026-06-03');

      expect(prismaMock.meals.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ mealtype: 'snacks' }) })
      );
    });
  });

  // ── calculateMeal ──────────────────────────────────────────────────────────

  describe('calculateMeal', () => {
    it('should return analyzed meal data from image', async () => {
      const aiResult = { name: 'Pasta', calories: 500, carbs: 80, protein: 20, fats: 10 };
      (analyzeFoodImage as jest.Mock).mockResolvedValue(aiResult);
      const mockImage = { buffer: Buffer.from(''), mimetype: 'image/jpeg' } as any;

      const result = await service.calculateMeal(mockImage, 'What is this?');

      expect(analyzeFoodImage).toHaveBeenCalledWith('What is this?', mockImage);
      expect(result).toEqual({ message: 'Meal calculated successfully', ...aiResult });
    });

    it('should throw if AI returns null', async () => {
      (analyzeFoodImage as jest.Mock).mockResolvedValue(null);

      await expect(service.calculateMeal({} as any)).rejects.toThrow('Could not analyze the meal');
    });
  });

  // ── analyzeFoodText ────────────────────────────────────────────────────────

  describe('analyzeFoodText', () => {
    it('should return analyzed meal data from text', async () => {
      const aiResult = { name: 'Apple', calories: 80, carbs: 20, protein: 0, fats: 0 };
      (analyzeFoodText as jest.Mock).mockResolvedValue(aiResult);

      const result = await service.analyzeFoodText('one apple');

      expect(analyzeFoodText).toHaveBeenCalledWith('one apple');
      expect(result).toEqual({ message: 'Meal analyzed successfully', ...aiResult });
    });

    it('should throw if AI returns null', async () => {
      (analyzeFoodText as jest.Mock).mockResolvedValue(null);

      await expect(service.analyzeFoodText('unknown food')).rejects.toThrow(
        'Could not analyze the meal'
      );
    });
  });
});
