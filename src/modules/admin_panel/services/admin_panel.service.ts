import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserRepository } from '../../repository/services/user.repository';

@Injectable()
export class AdminPanelService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      relations: { cars: true },
    });
  }

  public async findOne(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  public async toAdmin(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('The user does not exist!');
    }
    if (user.role === UserRoleEnum.ADMIN) {
      throw new BadRequestException('The user is admin!');
    }
    if (
      user.role === UserRoleEnum.USER_BUY ||
      user.role === UserRoleEnum.USER_SALE
    ) {
      await this.userRepository.update(userId, {
        role: UserRoleEnum.ADMIN,
      });
    }
  }

  public async toUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('The user does not exist!');
    }
    if (
      user.role === UserRoleEnum.USER_SALE ||
      user.role === UserRoleEnum.USER_BUY
    ) {
      throw new BadRequestException('The user is no admin!');
    }
    if (user.role === UserRoleEnum.ADMIN) {
      await this.userRepository.update(userId, {
        role: UserRoleEnum.USER_SALE,
      });
    }
  }

  public async banUser(userId: string, userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('The user does not exist!');
    }
    if (user.role === UserRoleEnum.ADMIN || UserRoleEnum.SUPERUSER) {
      if (userData.role === UserRoleEnum.ADMIN) {
        throw new BadRequestException('You do not have permissions!');
      }
    }
    if (!user.status) {
      throw new BadRequestException('The user is banned!');
    }
    await this.userRepository.update(userId, {
      status: false,
    });
  }

  public async unbanUser(userId: string, userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('The user does not exist!');
    }
    if (user.role === UserRoleEnum.ADMIN || UserRoleEnum.SUPERUSER) {
      if (userData.role === UserRoleEnum.ADMIN) {
        throw new BadRequestException('You do not have permissions!');
      }
    }
    if (user.status) {
      throw new BadRequestException('The user is active!');
    }
    await this.userRepository.update(userId, {
      status: true,
    });
  }
}
