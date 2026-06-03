import { Test, TestingModule } from '@nestjs/testing';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateMealDto, EditMealDto } from './dto/meals_dto';

// ── OpenAI Mock – prevents missing API key error on import ────────────────────

jest.mock('src/openai', () => ({
  analyzeImage: jest.fn(),
  analyzeFoodText: jest.fn(),
}));

// ── Mocks ──────────────────────────────────────────────────────────────────────

const mockMeal = { id: 1, user_id: 1, name: 'Oatmeal', calories: 300 };
const mockUser = { id: 1, email: 'test@test.de' };

const mockRequest = () => ({ user: mockUser });

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('MealsController', () => {
  let controller: MealsController;
  let mealsService: MealsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealsController],
      providers: [
        {
          provide: MealsService,
          useValue: {
            createMeal: jest.fn().mockResolvedValue(mockMeal),
            deleteMeal: jest.fn().mockResolvedValue({ message: 'Meal deleted successfully' }),
            editMeal: jest.fn().mockResolvedValue(mockMeal),
            getBreakfast: jest.fn().mockResolvedValue([mockMeal]),
            getLunch: jest.fn().mockResolvedValue([mockMeal]),
            getDinner: jest.fn().mockResolvedValue([mockMeal]),
            getSnack: jest.fn().mockResolvedValue([mockMeal]),
            calculateMeal: jest.fn().mockResolvedValue({ calories: 300 }),
            analyzeFoodText: jest.fn().mockResolvedValue({ calories: 200 }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MealsController>(MealsController);
    mealsService = module.get<MealsService>(MealsService);
  });

  // ── POST /meals ────────────────────────────────────────────────────────────

  describe('createMeal', () => {
    it('should create a meal and return it', async () => {
      const dto = {
        name: 'Oatmeal',
        calories: 300,
        carbs: 50,
        protein: 10,
        fats: 5,
        mealtype: 'breakfast',
      } as CreateMealDto;

      const result = await controller.createMeal(mockRequest() as any, dto);

      expect(mealsService.createMeal).toHaveBeenCalledWith(mockUser.id, dto);
      expect(result).toEqual(mockMeal);
    });
  });

  // ── DELETE /meals/:mealId ──────────────────────────────────────────────────

  describe('deleteMeal', () => {
    it('should delete a meal and return success message', async () => {
      const result = await controller.deleteMeal(mockRequest() as any, '1');

      expect(mealsService.deleteMeal).toHaveBeenCalledWith(mockUser.id, 1);
      expect(result).toEqual({ message: 'Meal deleted successfully' });
    });
  });

  // ── PUT /meals/:mealId ─────────────────────────────────────────────────────

  describe('editMeal', () => {
    it('should edit a meal and return updated meal', async () => {
      const body = { name: 'Updated Oatmeal', calories: 350 };

      const result = await controller.editMeal(mockRequest() as any, '1', body as any);

      expect(mealsService.editMeal).toHaveBeenCalledWith({ ...body, mealId: 1 }, mockUser.id);
      expect(result).toEqual(mockMeal);
    });
  });

  // ── GET /meals?type ────────────────────────────────────────────────────────

  describe('getMeals', () => {
    it('should return breakfast meals', async () => {
      const result = await controller.getMeals(mockRequest() as any, 'breakfast', '2026-06-03');

      expect(mealsService.getBreakfast).toHaveBeenCalledWith(mockUser.id, '2026-06-03');
      expect(result).toEqual([mockMeal]);
    });

    it('should return lunch meals', async () => {
      const result = await controller.getMeals(mockRequest() as any, 'lunch', '2026-06-03');

      expect(mealsService.getLunch).toHaveBeenCalledWith(mockUser.id, '2026-06-03');
      expect(result).toEqual([mockMeal]);
    });

    it('should return dinner meals', async () => {
      const result = await controller.getMeals(mockRequest() as any, 'dinner', '2026-06-03');

      expect(mealsService.getDinner).toHaveBeenCalledWith(mockUser.id, '2026-06-03');
      expect(result).toEqual([mockMeal]);
    });

    it('should return snack meals', async () => {
      const result = await controller.getMeals(mockRequest() as any, 'snack', '2026-06-03');

      expect(mealsService.getSnack).toHaveBeenCalledWith(mockUser.id, '2026-06-03');
      expect(result).toEqual([mockMeal]);
    });

    it('should throw NotFoundException for invalid meal type', async () => {
      await expect(
        controller.getMeals(mockRequest() as any, 'invalid', '2026-06-03')
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── POST /meals/calculate_meal ─────────────────────────────────────────────

  describe('calculateMeal', () => {
    it('should calculate meal from image and return result', async () => {
      const mockImage = { buffer: Buffer.from(''), mimetype: 'image/jpeg' } as any;

      const result = await controller.calculateMeal(mockImage, 'How many calories?');

      expect(mealsService.calculateMeal).toHaveBeenCalledWith(mockImage, 'How many calories?');
      expect(result).toEqual({ calories: 300 });
    });
  });

  // ── POST /meals/analyze_food_text ──────────────────────────────────────────

  describe('analyzeFoodText', () => {
    it('should analyze food text and return result', async () => {
      const result = await controller.analyzeFoodText('100g oatmeal');

      expect(mealsService.analyzeFoodText).toHaveBeenCalledWith('100g oatmeal');
      expect(result).toEqual({ calories: 200 });
    });
  });
});

// ── DTO Validation ─────────────────────────────────────────────────────────────

describe('CreateMealDto', () => {
  const validBase = {
    name: 'Oatmeal',
    calories: 300,
    carbs: 50,
    protein: 10,
    fats: 5,
    mealtype: 'breakfast',
  };

  it('should pass with all required fields', async () => {
    const dto = plainToInstance(CreateMealDto, validBase);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with optional date provided', async () => {
    const dto = plainToInstance(CreateMealDto, { ...validBase, date: '2026-06-03' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when name is missing', async () => {
    const { name, ...rest } = validBase;
    const dto = plainToInstance(CreateMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail when mealtype is missing', async () => {
    const { mealtype, ...rest } = validBase;
    const dto = plainToInstance(CreateMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'mealtype')).toBe(true);
  });

  it('should fail when calories is missing', async () => {
    const { calories, ...rest } = validBase;
    const dto = plainToInstance(CreateMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'calories')).toBe(true);
  });

  it('should fail when carbs is missing', async () => {
    const { carbs, ...rest } = validBase;
    const dto = plainToInstance(CreateMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'carbs')).toBe(true);
  });

  it('should fail when protein is missing', async () => {
    const { protein, ...rest } = validBase;
    const dto = plainToInstance(CreateMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'protein')).toBe(true);
  });

  it('should fail when fats is missing', async () => {
    const { fats, ...rest } = validBase;
    const dto = plainToInstance(CreateMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'fats')).toBe(true);
  });

  it('should fail when calories is a string instead of number', async () => {
    const dto = plainToInstance(CreateMealDto, { ...validBase, calories: 'abc' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'calories')).toBe(true);
  });

  it('should fail when mealtype is a number instead of string', async () => {
    const dto = plainToInstance(CreateMealDto, { ...validBase, mealtype: 123 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'mealtype')).toBe(true);
  });
});

describe('EditMealDto', () => {
  const validBase = {
    mealId: 5,
    name: 'Updated Meal',
    calories: 400,
    carbs: 60,
    protein: 15,
    fats: 8,
  };

  it('should pass with all required fields', async () => {
    const dto = plainToInstance(EditMealDto, validBase);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when mealId is missing', async () => {
    const { mealId, ...rest } = validBase;
    const dto = plainToInstance(EditMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'mealId')).toBe(true);
  });

  it('should fail when name is missing', async () => {
    const { name, ...rest } = validBase;
    const dto = plainToInstance(EditMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail when calories is missing', async () => {
    const { calories, ...rest } = validBase;
    const dto = plainToInstance(EditMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'calories')).toBe(true);
  });

  it('should fail when carbs is missing', async () => {
    const { carbs, ...rest } = validBase;
    const dto = plainToInstance(EditMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'carbs')).toBe(true);
  });

  it('should fail when protein is missing', async () => {
    const { protein, ...rest } = validBase;
    const dto = plainToInstance(EditMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'protein')).toBe(true);
  });

  it('should fail when fats is missing', async () => {
    const { fats, ...rest } = validBase;
    const dto = plainToInstance(EditMealDto, rest);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'fats')).toBe(true);
  });

  it('should fail when mealId is a string instead of number', async () => {
    const dto = plainToInstance(EditMealDto, { ...validBase, mealId: 'abc' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'mealId')).toBe(true);
  });

  it('should fail when name is a number instead of string', async () => {
    const dto = plainToInstance(EditMealDto, { ...validBase, name: 999 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });
});
