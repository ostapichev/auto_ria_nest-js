import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';

import { RefreshTokenEntity, UserEntity } from '../../../database/entities';
import { TokenType } from '../../../database/enums';
import { BaseResDto } from '../../mail-sender/dto/res/base-res.dto';
import { MailSenderService } from '../../mail-sender/services/mail-sender.service';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../../users/services/user.mapper';
import { ChangePassReqDto } from '../dto/req/change-pass.req.dto';
import { EmailPassRecoveryDto } from '../dto/req/email-pass-recovery.dto';
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
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly mailSenderService: MailSenderService,
  ) {}

  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      await this.isEmailExistOrThrow(dto.email);
      await this.isPhoneExistOrThrow(dto.phone);
      const userRepository = em.getRepository(UserEntity);
      const password = await bcrypt.hash(dto.password, 10);
      const user = await userRepository.save(
        this.userRepository.create({ ...dto, password }),
      );
      const tokens = await this.createTokens(user.id, dto.deviceId, em);
      await this.mailSenderService.sendMail({
        to: user.email,
        subject: 'The email from auto ria for registration',
        text: `For the finally registration push to link: http://localhost:3000/auth/activate/${tokens.accessToken}`,
      });
      return { user: UserMapper.toResponseItemDTO(user), tokens };
    });
  }

  public async activateUser(accessToken: string): Promise<BaseResDto> {
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const userRepository = em.getRepository(UserEntity);
      const payload = await this.tokenService.verifyToken(
        accessToken,
        TokenType.ACCESS,
      );
      const { userId, deviceId } = payload;
      const isAccessTokenExist = await this.authCacheService.isAccessTokenExist(
        userId,
        deviceId,
        accessToken,
      );
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!payload) {
        throw new BadRequestException('The token is not valid!');
      }
      if (!user || !isAccessTokenExist) {
        throw new BadRequestException('Invalid user data!');
      }
      await userRepository.update(userId, {
        status: true,
      });
      return { message: 'Activation is successful!' };
    });
  }

  public async recoveryPassword(
    dto: EmailPassRecoveryDto,
  ): Promise<BaseResDto> {
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const { email, deviceId } = dto;
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new BadRequestException('The user does not exist!');
      }
      const tokens = await this.createTokens(user.id, deviceId, em);
      await this.mailSenderService.sendMail({
        to: email,
        subject: 'The email from auto ria for recovery password',
        text: `For recovery password push to link: http://localhost:3000/auth/recovery-password/${tokens.accessToken}`,
      });
      return { message: `Check message in ${email}!` };
    });
  }

  public async changePassword(
    accessToken: string,
    dto: ChangePassReqDto,
  ): Promise<BaseResDto> {
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const userRepository = em.getRepository(UserEntity);
      const payload = await this.tokenService.verifyToken(
        accessToken,
        TokenType.ACCESS,
      );
      const isAccessTokenExist = await this.authCacheService.isAccessTokenExist(
        payload.userId,
        payload.deviceId,
        accessToken,
      );
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      const password = await bcrypt.hash(dto.password, 10);
      if (!payload) {
        throw new BadRequestException('The token is not valid!');
      }
      if (!user || !isAccessTokenExist) {
        throw new BadRequestException('Invalid user data!');
      }
      await userRepository.update(payload.userId, { password });
      return { message: 'Password is changed!' };
    });
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
        select: { id: true, password: true, status: true },
      });
      if (!user || !user.status) {
        throw new UnauthorizedException('The user does not exist or is banned');
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password or email');
      }
      const tokens = await this.createTokens(user.id, dto.deviceId, em);
      const userEntity = await this.userRepository.findOneBy({ id: user.id });
      return { user: UserMapper.toResponseItemDTO(userEntity), tokens };
    });
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      await this.deleteRefreshToken(userData);
      return await this.createTokens(userData.userId, userData.deviceId, em);
    });
  }

  public async signOut(userData: IUserData): Promise<void> {
    await this.deleteRefreshToken(userData);
  }

  private async createTokens(
    userId: string,
    deviceId: string,
    em: EntityManager,
  ): Promise<TokenPairResDto> {
    const tokens = await this.tokenService.generateAuthTokens({
      userId,
      deviceId,
    });
    const refreshTokenRepository = em.getRepository(RefreshTokenEntity);
    await Promise.all([
      refreshTokenRepository.save({
        deviceId,
        refreshToken: tokens.refreshToken,
        user_id: userId,
      }),
      this.authCacheService.saveToken(tokens.accessToken, userId, deviceId),
    ]);
    return tokens;
  }

  private async deleteRefreshToken(userData: IUserData): Promise<void> {
    const { userId, deviceId } = userData;
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: deviceId,
        user_id: userId,
      }),
      this.authCacheService.deleteToken(userId, deviceId),
    ]);
  }

  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email already exists');
    }
  }

  private async isPhoneExistOrThrow(phone: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ phone });
    if (user) {
      throw new ConflictException('Phone already exists');
    }
  }
}
