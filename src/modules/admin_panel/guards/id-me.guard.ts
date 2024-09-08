import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class IdMeGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.params;
    const user = request.user as UserEntity;
    return user.id !== userId;
  }
}
