import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper, UsersService } from '../../users/services';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
  ) {}

  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.userService.isEmailExistOrThrow(dto.email);
    await this.userService.isPhoneExistOrThrow(dto.phone);
    const password = await bcrypt.hash(dto.password, 10);
    const role = UserRoleEnum.USER_BUY;
    const account = AccountTypeEnum.BASIC;
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password, role, account }),
    );
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        deviceId: dto.deviceId,
        refreshToken: tokens.refreshToken,
        user_id: user.id,
      }),
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        dto.deviceId,
      ),
    ]);
    return { user: UserMapper.toResponseDTO(user), tokens };
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        user_id: user.id,
      }),
      this.authCacheService.deleteToken(user.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save({
        deviceId: dto.deviceId,
        refreshToken: tokens.refreshToken,
        user_id: user.id,
      }),
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        dto.deviceId,
      ),
    ]);
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return { user: UserMapper.toResponseDTO(userEntity), tokens };
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        deviceId: userData.deviceId,
        refreshToken: tokens.refreshToken,
        user_id: userData.userId,
      }),
      this.authCacheService.saveToken(
        tokens.accessToken,
        userData.userId,
        userData.deviceId,
      ),
    ]);

    return tokens;
  }

  public async signOut(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
  }
}
