import { IsString, IsNumber } from 'class-validator';

export class CreateMealDto {
  @IsString()
  name: string;
  @IsNumber()
  calories: number;
  @IsNumber()
  carbs: number;
  @IsNumber()
  protein: number;
  @IsNumber()
  fats: number;
  @IsString()
  mealtype: string;
}

export class EditMealDto {
  @IsNumber()
  mealId: number;
  @IsString()
  name: string;
  @IsNumber()
  calories: number;
  @IsNumber()
  carbs: number;
  @IsNumber()
  protein: number;
  @IsNumber()
  fats: number;
}
