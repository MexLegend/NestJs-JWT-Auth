import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENVIRONMENT_VARIABLES, JWT_STRATEGIES } from 'src/core/model';
import { ITokenPayload } from '../model';
import { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES.JWT_REFRESH,
) {
  constructor(
    readonly _configService: ConfigService,
    private readonly _dbService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(ENVIRONMENT_VARIABLES.JWT_REFRESH_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: ITokenPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    const user = await this._dbService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hash;
    return { user, refreshToken };
  }
}
