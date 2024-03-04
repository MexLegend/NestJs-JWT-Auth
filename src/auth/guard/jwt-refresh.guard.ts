import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGIES } from 'src/core/model';

export class JwtRefreshGuard extends AuthGuard(JWT_STRATEGIES.JWT_REFRESH) {
  constructor() {
    super();
  }
}
