import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class EmailChangeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from !@#$%^&*',
  })
  password: string;
}

export class PasswordChangeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from !@#$%^&*',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}

export class DeleteProfileDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from !@#$%^&*',
  })
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsOptional()
  @IsNumber()
  age?: number;
  @IsString()
  @IsOptional()
  gender?: string;

  @IsOptional()
  @IsNumber()
  waist?: number;

  @IsOptional()
  @IsNumber()
  hip?: number;

  @IsOptional()
  @IsNumber()
  bpf?: number;

  @IsString()
  @IsOptional()
  activity_level?: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsNumber()
  bmi?: number;

  @IsOptional()
  @IsNumber()
  calories?: number;

  @IsOptional()
  @IsNumber()
  bfp?: number;
}
