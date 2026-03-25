import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(@Inject('PRISMA_USER') private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.users.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.users.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.users.delete({ where: { id } });
  }
}
