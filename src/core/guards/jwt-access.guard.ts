import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGIES, PUBLIC_GUARD_KEY } from 'src/core/constants';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAccessGuard extends AuthGuard(JWT_STRATEGIES.JWT_ACCESS) {
  constructor(private readonly _reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this._reflector.getAllAndOverride(PUBLIC_GUARD_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const isAuthenticated = (await super.canActivate(context)) as boolean;
    return isAuthenticated;
  }
}
