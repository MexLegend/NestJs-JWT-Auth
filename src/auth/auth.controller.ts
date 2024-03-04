import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ITokenResponse } from './models';
import { JwtAccessGuard } from '../core/guards';
import { JwtRefreshGuard } from '../core/guards/jwt-refresh.guard';
import { GetUser, Public } from '../core/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Public()
  @Post('local/signup')
  signUpLocal(@Body() dto: AuthDto): Promise<ITokenResponse> {
    return this._authService.signUpLocal(dto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: AuthDto): Promise<ITokenResponse> {
    return this._authService.signInLocal(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signOut(@GetUser('sub') userId: string) {
    return this._authService.signOut(userId);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetUser('sub') userId: string,
    @GetUser('rt') refreshToken: string,
  ) {
    return this._authService.refreshTokens({
      userId,
      refreshToken,
    });
  }
}
