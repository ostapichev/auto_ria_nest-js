import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseResDto } from '../mail-sender/dto/res/base-res.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { ChangePassReqDto } from './dto/req/change-pass.req.dto';
import { EmailPassRecoveryDto } from './dto/req/email-pass-recovery.dto';
import { SignInReqDto } from './dto/req/sign-in.req.dto';
import { SignUpReqDto } from './dto/req/sign-up.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { TokenPairResDto } from './dto/res/token-pair.res.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.authService.signUp(dto);
  }

  @SkipAuth()
  @Post('activate/:accessToken')
  public async activateUser(
    @Param('accessToken') accessToken: string,
  ): Promise<BaseResDto> {
    return await this.authService.activateUser(accessToken);
  }

  @SkipAuth()
  @Post('recovery-password')
  public async recoveryPassword(
    @Body() dto: EmailPassRecoveryDto,
  ): Promise<BaseResDto> {
    return await this.authService.recoveryPassword(dto);
  }

  @SkipAuth()
  @Post('recovery-password/:accessToken')
  public async changePassword(
    @Param('accessToken') accessToken: string,
    @Body() dto: ChangePassReqDto,
  ): Promise<BaseResDto> {
    return await this.authService.changePassword(accessToken, dto);
  }

  @SkipAuth()
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @SkipAuth()
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.signOut(userData);
  }
}
