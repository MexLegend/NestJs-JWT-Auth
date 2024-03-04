import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGIES } from 'src/core/constants';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_STRATEGIES.JWT_REFRESH) {
  constructor() {
    super();
  }
}
