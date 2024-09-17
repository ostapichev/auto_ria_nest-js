import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AuthCacheService } from '../../auth/services/auth-cache.service';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateBalanceDto } from '../dto/req/update-balance.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly authCacheService: AuthCacheService,
  ) {}

  public async findMe(userData: IUserData): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userData.userId });
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new NotFoundException('The user does not exist!');
    }
    this.userRepository.merge(user, dto);
    return await this.userRepository.save(user);
  }

  public async addBalanceMe(
    userData: IUserData,
    dto: UpdateBalanceDto,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new NotFoundException('The user does not exist!');
    }
    await this.userRepository.increment(
      { id: user.id },
      'balance',
      dto.balance,
    );
  }

  public async getPremium(userData: IUserData, sum: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user || user.account === 'premium') {
      throw new NotFoundException('The user does not exist!');
    }
    if (user.balance < sum) {
      throw new BadRequestException('Balance is low!');
    }
    await this.userRepository.decrement({ id: user.id }, 'balance', sum);
    await this.userRepository.update(user.id, {
      account: AccountTypeEnum.PREMIUM,
    });
  }

  public async getBasic(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user || user.account === 'basic') {
      throw new NotFoundException('The user does not exist!');
    }
    await this.userRepository.update(user.id, {
      account: AccountTypeEnum.BASIC,
    });
  }

  public async removeMe(userData: IUserData): Promise<void> {
    await this.userRepository.delete({ id: userData.userId });
    await this.authCacheService.deleteToken(userData.userId, userData.deviceId);
  }

  public async findOne(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.getByIdUser(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.fileStorageService.uploadFile(
      avatar,
      ContentType.AVATAR,
      userData.userId,
    );
    await this.userRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.userRepository.save(
        this.userRepository.merge(user, { image: null }),
      );
    }
  }

  public async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email already exists');
    }
  }

  public async isPhoneExistOrThrow(phone: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ phone });
    if (user) {
      throw new ConflictException('Phone already exists');
    }
  }
}
