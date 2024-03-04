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
import { ITokenResponse } from './model';
import { AuthGuard } from '@nestjs/passport';
import { JwtAccessGuard } from './guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('local/signup')
  signUpLocal(@Body() dto: AuthDto): Promise<ITokenResponse> {
    return this._authService.signUpLocal(dto);
  }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: AuthDto): Promise<ITokenResponse> {
    return this._authService.signInLocal(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signOut(@GetUser('id') userId: string) {
    return this._authService.signOut(userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens() {
    return this._authService.refreshTokens();
  }
}
