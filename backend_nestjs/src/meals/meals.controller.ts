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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMealDto, EditMealDto } from './dto/meals_dto';
import { User } from 'src/types';
import { MulterFile } from 'src/openai';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create_meal')
  async createMeal(@Req() req: { user: User }, @Body() createMealDto: any) {
    return this.mealsService.createMeal(req.user.id, createMealDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('calculate_meal')
  @UseInterceptors(FileInterceptor('image'))
  async calculateMeal(@UploadedFile() image: MulterFile, @Body('prompt') prompt?: string) {
    return this.mealsService.calculateMeal(image, prompt);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete_meal')
  async deleteMeal(@Req() req: { user: User }, @Body() body: { mealId: number }) {
    return this.mealsService.deleteMeal(req.user.id, body.mealId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('edit_meal')
  async editMeal(@Req() req: { user: User }, @Body() body: EditMealDto) {
    return this.mealsService.editMeal(body, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get_breakfast')
  async getBreakfast(@Req() req: { user: User }, @Query('date') date?: string) {
    return this.mealsService.getBreakfast(req.user.id, date);
  }
  @UseGuards(JwtAuthGuard)
  @Get('get_lunch')
  async getLunch(@Req() req: { user: User }, @Query('date') date?: string) {
    return this.mealsService.getLunch(req.user.id, date);
  }
  @UseGuards(JwtAuthGuard)
  @Get('get_dinner')
  async getDinner(@Req() req: { user: User }, @Query('date') date?: string) {
    return this.mealsService.getDinner(req.user.id, date);
  }
  @UseGuards(JwtAuthGuard)
  @Get('get_snack')
  async getSnack(@Req() req: { user: User }, @Query('date') date?: string) {
    return this.mealsService.getSnack(req.user.id, date);
  }
}
