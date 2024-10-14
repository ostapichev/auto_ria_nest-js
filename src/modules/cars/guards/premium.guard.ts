import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entities';
import { AccountTypeEnum } from '../../../database/enums';

@Injectable()
export class PremiumGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    return user.account === AccountTypeEnum.PREMIUM;
  }
}
