import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENVIRONMENT_VARIABLES, JWT_STRATEGIES } from 'src/core/model';
import { DatabaseService } from 'src/database/database.service';
import { ITokenPayload } from '../model';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES.JWT_ACCESS,
) {
  constructor(
    readonly _configService: ConfigService,
    private readonly _dbService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(ENVIRONMENT_VARIABLES.JWT_ACCESS_SECRET),
    });
  }

  async validate(payload: ITokenPayload) {
    const user = await this._dbService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hash;
    return user;
  }
}
