import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENVIRONMENT_VARIABLES, JWT_STRATEGIES } from 'src/core/constants';
import { ITokenPayload, ITokenStategyResponse } from '../models';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES.JWT_ACCESS,
) {
  constructor(readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(ENVIRONMENT_VARIABLES.JWT_ACCESS_SECRET),
    });
  }

  async validate(payload: ITokenPayload): Promise<ITokenStategyResponse> {
    return payload;
  }
}
