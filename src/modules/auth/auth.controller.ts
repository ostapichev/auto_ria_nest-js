import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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

  @ApiOperation({ description: 'Create new user' })
  @SkipAuth()
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.authService.signUp(dto);
  }

  @ApiOperation({ description: 'Activation user by access token from email' })
  @SkipAuth()
  @Post('activate/:accessToken')
  public async activateUser(
    @Param('accessToken') accessToken: string,
  ): Promise<BaseResDto> {
    return await this.authService.activateUser(accessToken);
  }

  @ApiOperation({ description: 'Recovery password' })
  @SkipAuth()
  @Post('recovery-password')
  public async recoveryPassword(
    @Body() dto: EmailPassRecoveryDto,
  ): Promise<BaseResDto> {
    return await this.authService.recoveryPassword(dto);
  }

  @ApiOperation({ description: 'Change password by access token from email' })
  @SkipAuth()
  @Post('recovery-password/:accessToken')
  public async changePassword(
    @Param('accessToken') accessToken: string,
    @Body() dto: ChangePassReqDto,
  ): Promise<BaseResDto> {
    return await this.authService.changePassword(accessToken, dto);
  }

  @ApiOperation({ description: 'Login user' })
  @SkipAuth()
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.signIn(dto);
  }

  @ApiOperation({ description: 'Post refresh token for get new tokens' })
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @SkipAuth()
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }

  @ApiOperation({ description: 'Log out' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.signOut(userData);
  }
}
