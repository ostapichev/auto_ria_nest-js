import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';
import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class PremiumGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    return user.account === AccountTypeEnum.PREMIUM;
  }
}
