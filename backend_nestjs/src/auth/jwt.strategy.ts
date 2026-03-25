import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('PRISMA_USER') private prisma: PrismaClient) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
      issuer: 'fitness-app',
      audience: 'fitness-users',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.users.findUnique({ where: { id: payload.sub } });
    return user;
  }
}
