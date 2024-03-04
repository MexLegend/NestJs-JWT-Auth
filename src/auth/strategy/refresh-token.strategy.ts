import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  AUTHORIZATION_HEADER_KEY,
  BEARER_KEY,
  ENVIRONMENT_VARIABLES,
  JWT_STRATEGIES,
} from 'src/core/constants';
import { ITokenPayload, ITokenStategyResponse } from '../models';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES.JWT_REFRESH,
) {
  constructor(readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(ENVIRONMENT_VARIABLES.JWT_REFRESH_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: ITokenPayload,
  ): Promise<ITokenStategyResponse> {
    const rt = req.get(AUTHORIZATION_HEADER_KEY).replace(BEARER_KEY, '').trim();

    return { ...payload, rt };
  }
}
