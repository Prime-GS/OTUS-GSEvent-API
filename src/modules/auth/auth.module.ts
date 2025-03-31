import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { AuthService, SessionService } from './services';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './resolvers';
import { JwtStrategy } from './strategies';
import { RolesGuard } from './guards';
import { Session } from './entities';

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
