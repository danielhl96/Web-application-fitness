import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { redisClient } from '../redis';
import { User, JwtPayload } from '../types';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const token = req?.cookies?.jwt;
    if (token) {
      const blacklisted = await redisClient.get(`blacklist_${token}`);
      if (blacklisted) throw new UnauthorizedException('Token has been invalidated');
    }
    return { id: payload.sub, email: payload.email };
  }
}
