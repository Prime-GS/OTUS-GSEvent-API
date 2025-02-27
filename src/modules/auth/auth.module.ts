import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { Session } from './entities';
import { AuthService, SessionService } from './services';
import { AuthResolver } from './resolvers';
import { JwtStrategy } from './strategies';
import { RolesGuard } from './guards';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([Session]),
    UsersModule,
  ],
  providers: [
    SessionService,
    AuthResolver,
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],
  exports: [],
})
export class AuthModule {}
