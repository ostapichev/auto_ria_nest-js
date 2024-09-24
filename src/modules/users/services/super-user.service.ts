import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Config, SuperUserConfig } from '../../../config';
import { UserEntity } from '../../../database/entities';
import {
  AccountTypeEnum,
  UserRoleEnum,
} from '../../../database/entities/enums';
import { UserRepository } from '../../repository/services/user.repository';

@Injectable()
export class SuperUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService<Config>,
  ) {}

  public async createSuperUser(): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      role: UserRoleEnum.SUPERUSER,
    });
    if (!user) {
      const config = this.configService.get<SuperUserConfig>('superuser');
      const password = await bcrypt.hash(config.password, 10);
      await this.userRepository.save({
        name: config.name,
        phone: config.phone,
        email: config.email,
        password: password,
        role: UserRoleEnum.SUPERUSER,
        account: AccountTypeEnum.PREMIUM,
        status: true,
      });
      Logger.log('Super user created!');
      return user;
    }
  }
}
