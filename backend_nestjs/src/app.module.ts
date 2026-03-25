import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  providers: [UsersService],
})
export class AppModule {}
