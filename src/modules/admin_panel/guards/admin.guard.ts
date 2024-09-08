import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    return (
      user.role === UserRoleEnum.SUPERUSER || user.role === UserRoleEnum.ADMIN
    );
  }
}
