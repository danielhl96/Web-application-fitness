import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserData } from 'src/types';
@Injectable()
export class UsersService {
  constructor(@Inject('PRISMA_USER') private prisma: PrismaClient) {}

  async getHistory(id: number) {
    return this.prisma.history_body_metrics.findMany({ where: { user_id: id } });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        height: true,
        weight: true,
        age: true,
        gender: true,
        waist: true,
        hip: true,
        bfp: true,
        activity_level: true,
        goal: true,
        bmi: true,
        calories: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: UserData) {
    return this.prisma.users.update({ where: { id }, data });
  }

  async changeEmail(id: number, email: string) {
    await this.prisma.users.update({ where: { id }, data: { email } });
    return { message: 'Email updated successfully' };
  }
  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const passwordFromDb = await this.prisma.users.findUnique({
      where: { id },
      select: { password: true },
    });

    if (!passwordFromDb) {
      throw new NotFoundException('User not found');
    }

    if (!(await argon2.verify(passwordFromDb.password, oldPassword))) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedPassword = await argon2.hash(newPassword);
    await this.prisma.users.update({ where: { id }, data: { password: hashedPassword } });
    return { message: 'Password updated successfully' };
  }

  async updateHistory(id: number, data: UserData) {
    const weight = data.weight;
    const hip = data.hip;
    const waist = data.waist;
    const bpf = data.bpf;
    const history_data = { weight, hip, waist, bpf };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.history_body_metrics
      .findFirst({ where: { user_id: id, date: { gte: today, lt: tomorrow } } })
      .then((existingEntry) => {
        if (existingEntry) {
          // Update the existing entry
          return this.prisma.history_body_metrics.update({
            where: { id: existingEntry.id },
            data: { ...history_data, date: today },
          });
        } else {
          // Create a new entry
          return this.prisma.history_body_metrics.create({
            data: { ...history_data, user_id: id, date: today },
          });
        }
      });
  }

  async remove(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.users.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
