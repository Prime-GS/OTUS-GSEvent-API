import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/services';
import { UserDTO } from '../../users/dto';
import { IAuthResponse, IJwtPayload } from '../interfaces';
import { LoginDTO } from '../dto';
import { User } from '../../users/entities';
import { SessionService } from './session.service';
import { Session } from '../entities';
import { UpdateUserDTO } from '../../users/dto/updateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private sessionService: SessionService,
  ) {}

  async login(input: LoginDTO): Promise<IAuthResponse> {
    const user = await this.usersService.findUser(input.login);

    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new UnauthorizedException();
    }
    const session = await this.sessionService.upsert(user.id);
    const token = this.generateJwtToken(user, session);

    return {
      user,
      token,
    };
  }

  async registration(input: UserDTO): Promise<IAuthResponse> {
    const user = await this.usersService.create(input);
    const session = await this.sessionService.upsert(user.id);
    const token = this.generateJwtToken(user, session);

    return {
      user,
      token,
    };
  }

  async updateMyProfile(input: UpdateUserDTO): Promise<User> {
    return this.usersService.updateProfile(input);
  }

  private generateJwtToken(user: User, session: Session) {
    const payload: IJwtPayload = {
      id: user.id,
      login: user.email,
      sessionToken: session.sessionToken,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    return token;
  }

  async verifyToken(token: string) {
    if (
      !(await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }))
    ) {
      throw new UnauthorizedException('Недействительный токен');
    }
    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    await this.verifyToken(token);
    const user = this.jwtService.decode<User>(token);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    await this.usersService.changePassword(newPassword, user);

    return true;
  }
}
