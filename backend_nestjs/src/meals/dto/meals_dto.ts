import { IsString, IsNumber, IsOptional } from 'class-validator';

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
  @IsOptional()
  @IsString()
  date?: string;
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
