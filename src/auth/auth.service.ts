import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { hash, verify } from 'argon2';
import { AuthDto } from './dto';
import { ENVIRONMENT_VARIABLES } from 'src/core/model';
import { IRefreshTokenPayload, ITokenPayload, ITokenResponse } from './model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly _dbService: DatabaseService,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  async signUpLocal(dto: AuthDto): Promise<ITokenResponse> {
    try {
      // Generate password hash
      const hashedPassword = await hash(dto.password);

      // Save new user to db
      const user = await this._dbService.user.create({
        data: {
          email: dto.email,
          hash: hashedPassword,
        },
      });

      // Get tokens
      const tokens = await this.getTokens({ sub: user.id, email: user.email });

      // Update DB refresh token hash
      await this.updateDBRefreshTokenHash({
        userId: user.id,
        refreshToken: tokens.refresh_token,
      });

      // Return tokens
      return tokens;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials Taken');
      }
      throw error;
    }
  }

  async signInLocal(dto: AuthDto): Promise<ITokenResponse> {
    // Find user by email
    const user = await this._dbService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If user does not exists throw exception
    if (!user) throw new ForbiddenException('Credentials Incorrect');

    // Compare password
    const pwMatches = await verify(user.hash, dto.password);

    // If password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials Incorrect');

    // Get tokens
    const tokens = await this.getTokens({ sub: user.id, email: user.email });

    // Update DB refresh token hash
    await this.updateDBRefreshTokenHash({
      userId: user.id,
      refreshToken: tokens.refresh_token,
    });

    // Return tokens
    return tokens;
  }

  async signOut(userId: string) {
    await this._dbService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async updateDBRefreshTokenHash(payload: IRefreshTokenPayload) {
    // Generate refresh token hash
    const hashedRefreshToken = await hash(payload.refreshToken);

    // Update DB refresh token hash
    await this._dbService.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        hashedRt: hashedRefreshToken,
      },
    });
  }

  async getTokens(payload: ITokenPayload): Promise<ITokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this._jwtService.signAsync(payload, {
        expiresIn: this._configService.get(
          ENVIRONMENT_VARIABLES.JWT_ACCESS_EXPIRATION,
        ),
        secret: this._configService.get(
          ENVIRONMENT_VARIABLES.JWT_ACCESS_SECRET,
        ),
      }),
      this._jwtService.signAsync(payload, {
        expiresIn: this._configService.get(
          ENVIRONMENT_VARIABLES.JWT_REFRESH_EXPIRATION,
        ),
        secret: this._configService.get(
          ENVIRONMENT_VARIABLES.JWT_REFRESH_SECRET,
        ),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens() {}
}
