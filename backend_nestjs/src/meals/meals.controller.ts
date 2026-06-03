import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MealsService } from './meals.service';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Delete,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMealDto, EditMealDto } from './dto/meals_dto';
import { User } from 'src/types';
import { MulterFile } from 'src/openai';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMeal(@Req() req: { user: User }, @Body() createMealDto: CreateMealDto) {
    return this.mealsService.createMeal(req.user.id, createMealDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('calculate_meal')
  @UseInterceptors(FileInterceptor('image'))
  async calculateMeal(@UploadedFile() image: MulterFile, @Body('prompt') prompt?: string) {
    return this.mealsService.calculateMeal(image, prompt);
  }

  @UseGuards(JwtAuthGuard)
  @Post('analyze_food_text')
  async analyzeFoodText(@Body('text') text: string) {
    return this.mealsService.analyzeFoodText(text);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':mealId')
  async deleteMeal(@Req() req: { user: User }, @Param('mealId') mealId: string) {
    return this.mealsService.deleteMeal(req.user.id, Number(mealId));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':mealId')
  async editMeal(
    @Req() req: { user: User },
    @Param('mealId') mealId: string,
    @Body() body: Omit<EditMealDto, 'mealId'>
  ) {
    return this.mealsService.editMeal({ ...body, mealId: Number(mealId) }, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMeals(
    @Req() req: { user: User },
    @Query('type') type: string,
    @Query('date') date?: string
  ) {
    switch (type) {
      case 'breakfast':
        return this.mealsService.getBreakfast(req.user.id, date);
      case 'lunch':
        return this.mealsService.getLunch(req.user.id, date);
      case 'dinner':
        return this.mealsService.getDinner(req.user.id, date);
      case 'snack':
        return this.mealsService.getSnack(req.user.id, date);
      default:
        throw new NotFoundException('Invalid meal type');
    }
  }
}
