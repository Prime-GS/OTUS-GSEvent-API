import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    return request;
  }

  handleRequest(err: any, data: any, info: any, context: ExecutionContext) {
    if (err || !data) {
      throw err || new UnauthorizedException();
    }

    const ctx = GqlExecutionContext.create(context);
    ctx.getContext().req.payload = data.payload;

    return data.user;
  }
}
