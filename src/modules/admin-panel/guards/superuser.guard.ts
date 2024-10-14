import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entities';
import { UserRoleEnum } from '../../../database/enums';

@Injectable()
export class SuperUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    return user.role === UserRoleEnum.SUPERUSER;
  }
}
