import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IJwtPayload } from '../interfaces';
import { UsersService } from '../../users/services';
import { User } from '../../users/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(
    payload: IJwtPayload,
  ): Promise<{ user: User; payload: IJwtPayload }> {
    const user = await this.authorizeUser(payload);

    return { user, payload };
  }

  private async authorizeUser(payload: IJwtPayload): Promise<User> {
    const user = await this.userService.findUser(payload.login);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
