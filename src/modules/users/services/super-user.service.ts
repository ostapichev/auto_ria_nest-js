import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Config, SuperUserConfig } from '../../../config/config.type';
import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserEntity } from '../../../database/entities/user.entity';
import { UserRepository } from '../../repository/services/user.repository';

@Injectable()
export class SuperUserService {
  private superUserConfig: SuperUserConfig;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService<Config>,
  ) {
    this.superUserConfig = this.configService.get<SuperUserConfig>('superuser');
  }

  public async createSuperUser(): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      role: UserRoleEnum.SUPERUSER,
    });
    if (!user) {
      const config = this.configService.get<SuperUserConfig>('superuser');
      await this.userRepository.save({
        name: config.name,
        phone: config.phone,
        email: config.email,
        password: await bcrypt.hash(config.password, 10),
        role: UserRoleEnum.SUPERUSER,
        account: AccountTypeEnum.PREMIUM,
      });
      Logger.log('Super user created!');
      return user;
    }
  }
}
