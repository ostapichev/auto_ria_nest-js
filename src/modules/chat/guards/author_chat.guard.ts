import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserEntity } from '../../../database/entities/user.entity';
import { MessageRepository } from '../../repository/services/message.repository';

@Injectable()
export class AuthorChatGuard implements CanActivate {
  constructor(private readonly messageRepository: MessageRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    const { userId } = request.user;
    const { messageId } = request.params;
    const message = await this.messageRepository.findOneBy({ id: messageId });
    return (
      (message && user && user.role === UserRoleEnum.SUPERUSER) ||
      user.role === UserRoleEnum.ADMIN ||
      message.from_user_id === userId
    );
  }
}
