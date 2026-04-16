import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
  HttpCode,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response, Request } from 'express';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '../types';
import { redisClient } from '../redis';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    if (!user) throw new BadRequestException('Registration failed');
    return { message: 'Registered successfully' };
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const { access_token } = await this.authService.login(user);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 * 3, // 3 hours
    });
    return { message: 'Logged in successfully' };
  }

  @Post('password_forget')
  async passwordForget(@Body() body: { email: string }) {
    await this.authService.passwordForget(body.email);
    return { message: 'Password reset email sent' };
  }

  @Post('password_reset')
  async passwordReset(@Body() body: { safetycode: string; newPassword: string; email: string }) {
    await this.authService.passwordReset(body.safetycode, body.newPassword, body.email);
    return { message: 'Password reset successfully' };
  }

  @Get('check_auth')
  @UseGuards(JwtAuthGuard)
  checkAuth(@Req() req: { user: User }) {
    return { authenticated: true, user: req.user };
  }

  @Post('refresh_token')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Req() req: { user: User }, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.refreshToken(req.user as User);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });
    return { message: 'Token refreshed successfully' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const token = req.cookies?.jwt;
    if (token) {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redisClient.set(`blacklist_${token}`, 'true', { EX: ttl });
        console.log(`Token blacklisted for ${ttl} seconds`);
      }
    }
    res.clearCookie('jwt');
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: { user: User }) {
    return req.user;
  }
}
