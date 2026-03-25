import { Module } from '@nestjs/common';
import { prismaUser } from '../../prisma/Prisma';

@Module({
  providers: [
    {
      provide: 'PRISMA_USER',
      useValue: prismaUser,
    },
  ],
  exports: ['PRISMA_USER'],
})
export class PrismaModule {}
