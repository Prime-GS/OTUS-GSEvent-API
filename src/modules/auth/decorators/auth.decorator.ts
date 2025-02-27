import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { JwtAuthGuard, RolesGuard } from '../guards';

export function AuthUser() {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard));
}

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
