import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMealDto, EditMealDto } from './dto/meals_dto';
import { analyzeFoodImage, analyzeFoodText, MulterFile } from 'src/openai';
@Injectable()
export class MealsService {
  constructor(@Inject('PRISMA_USER') private prismaUser: PrismaClient) {}

  private today(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async createMeal(userId: number, mealData: CreateMealDto) {
    await this.prismaUser.meals.create({
      data: {
        user_id: userId,
        name: mealData.name,
        mealtype: mealData.mealtype,
        calories: mealData.calories,
        carbs: mealData.carbs,
        protein: mealData.protein,
        fats: mealData.fats,
        date: this.today(),
      },
    });
    return { message: 'Meal created successfully' };
  }
  async deleteMeal(userId: number, mealId: number) {
    await this.prismaUser.meals.deleteMany({
      where: {
        id: mealId,
        user_id: userId,
      },
    });
    return { message: 'Meal deleted successfully' };
  }
  async editMeal(mealData: EditMealDto, userId: number) {
    await this.prismaUser.meals.updateMany({
      where: {
        id: mealData.mealId,
        user_id: userId,
      },
      data: {
        name: mealData.name,
        calories: mealData.calories,
        carbs: mealData.carbs,
        protein: mealData.protein,
        fats: mealData.fats,
      },
    });
    return { message: 'Meal updated successfully' };
  }

  async calculateMeal(imageFile: MulterFile, prompt?: string) {
    const result = await analyzeFoodImage(prompt, imageFile);
    if (!result) {
      throw new Error(
        'Could not analyze the meal. Please try again with a clearer image or more detailed prompt.'
      );
    }
    console.log('Meal analysis result:', result);
    return {
      message: 'Meal calculated successfully',
      name: result.name,
      calories: result.calories,
      carbs: result.carbs,
      protein: result.protein,
      fats: result.fats,
    };
  }

  async analyzeFoodText(text: string) {
    const result = await analyzeFoodText(text);
    if (!result) {
      throw new Error('Could not analyze the meal. Please try again with a clearer description.');
    }
    console.log('Meal analysis result:', result);
    return {
      message: 'Meal analyzed successfully',
      name: result.name,
      calories: result.calories,
      carbs: result.carbs,
      protein: result.protein,
      fats: result.fats,
    };
  }

  async createLunch(userId: number, mealData: CreateMealDto) {
    await this.prismaUser.meals.create({
      data: {
        user_id: userId,
        name: mealData.name,
        mealtype: 'lunch',
        calories: mealData.calories,
        carbs: mealData.carbs,
        protein: mealData.protein,
        fats: mealData.fats,
        date: this.today(),
      },
    });
    return { message: 'Lunch created successfully' };
  }

  async getBreakfast(userId: number, date?: string) {
    return this.prismaUser.meals.findMany({
      where: {
        user_id: userId,
        mealtype: 'breakfast',
        date: date ? new Date(date) : undefined,
      },
      orderBy: { date: 'desc' },
    });
  }
  async getLunch(userId: number, date?: string) {
    return this.prismaUser.meals.findMany({
      where: {
        user_id: userId,
        mealtype: 'launch',
        ...(date && { date: new Date(date) }),
      },
      orderBy: { date: 'desc' },
    });
  }
  async getDinner(userId: number, date?: string) {
    console.log('Getting dinner for user:', userId, 'on date:', date);
    return this.prismaUser.meals.findMany({
      where: {
        user_id: userId,
        mealtype: 'dinner',
        ...(date && { date: new Date(date) }),
      },
      orderBy: { date: 'desc' },
    });
  }
  async getSnack(userId: number, date?: string) {
    return this.prismaUser.meals.findMany({
      where: {
        user_id: userId,
        mealtype: 'snacks',
        ...(date && { date: new Date(date) }),
      },
      orderBy: { date: 'desc' },
    });
  }
}
