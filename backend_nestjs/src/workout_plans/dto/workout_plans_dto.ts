import { IsString, IsInt, IsArray, IsOptional, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ExerciseDto {
  @IsString()
  name: string;

  @IsInt()
  sets: number;

  @IsArray()
  reps: number[];

  @IsArray()
  weights: number[];

  @IsOptional()
  @IsInt()
  plan_id?: number;
}

export class CreateExerciseDto {
  @IsInt()
  workout_plan_id: number;

  @IsString()
  name: string;

  @IsInt()
  sets: number;

  @IsArray()
  reps: number[];

  @IsArray()
  weights: number[];
}

export class CreateWorkoutPlanDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}

export class DeleteWorkoutPlanDto {
  @IsInt()
  planId: number;
}

export class EditWorkoutPlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsInt()
  plan_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}

export class ChangeWorkoutPlanNameDto {
  @IsInt()
  planId: number;

  @IsString()
  newName: string;
}
