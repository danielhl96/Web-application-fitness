import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { User } from '../types';
import * as nodemailer from 'nodemailer';
import { v4 as randomUID } from 'uuid';
import { redisClient } from '../redis';

@Injectable()
export class AuthService {
  constructor(
    @Inject('PRISMA_USER') private prisma: PrismaClient,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) throw new UnauthorizedException('User not found');

    if (user && (await argon2.verify(user.password, password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };
    console.log('Generating JWT for user:', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async refreshToken(user: User): Promise<{ access_token: string }> {
    const userFromDb = await this.prisma.users.findUnique({ where: { id: user.id } });
    if (!userFromDb) {
      throw new UnauthorizedException('User not found');
    }
    const payload = { email: userFromDb.email, sub: userFromDb.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"${process.env.SMTP_USER}" <${process.env.SMTP_USER}>`, // sender address
        to, // list of recipients
        subject, // subject line
        text, // plain text body
      });

      console.log('Message sent: %s', info.messageId);
      // Preview URL is only available when using an Ethereal test account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error('Error while sending mail:', err);
    }
  }
  async passwordReset(safetycode: string, newPassword: string, email: string): Promise<void> {
    const userId = await redisClient.get(`password-reset:${safetycode}`);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired safety code');
    }
    const hashedPassword = await argon2.hash(newPassword);
    await this.prisma.users.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    });
    await redisClient.del(`password-reset:${safetycode}`);
  }

  async passwordForget(email: string): Promise<void> {
    const userFromDb = await this.prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!userFromDb) {
      throw new UnauthorizedException();
    }
    const safetycode = randomUID();
    await redisClient.set(`password-reset:${safetycode}`, userFromDb.id.toString(), { EX: 3600 });

    await this.sendEmail(
      userFromDb.email,
      'Password Reset',
      'Your safetycode for resetting: ' + safetycode.toString()
    );
  }

  async register(data: { email: string; password: string }): Promise<User> {
    const hashedPassword = await argon2.hash(data.password);
    const user = await this.prisma.users.create({
      data: { ...data, email: data.email.toLowerCase(), password: hashedPassword },
    });
    return user;
  }
}
