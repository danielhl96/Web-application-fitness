import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCardioWorkoutDto {
  @IsNumber()
  @Min(0.01)
  durationMin: number;

  @IsNumber()
  @Min(0.01)
  distanceKm: number;

  @IsInt()
  @Min(1)
  avgBpm: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxBpm?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  powerW?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  cadenceSpm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
