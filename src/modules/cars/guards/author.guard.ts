import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

import {
  CarEntity,
  MessageEntity,
  UserEntity,
} from '../../../database/entities';
import { UserRoleEnum } from '../../../database/enums';
import { CarRepository } from '../../repository/services/car.repository';
import { MessageRepository } from '../../repository/services/message.repository';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    const { userId } = request.user;
    const { carId, messageId } = request.params;
    let car: CarEntity;
    let message: MessageEntity;
    if ((carId && !isUUID(carId)) || (messageId && !isUUID(messageId))) {
      throw new BadRequestException('Invalid ID format!');
    }
    if (carId) {
      car = await this.carRepository.findOneBy({ id: carId });
      if (!car) {
        throw new NotFoundException('Car not found!');
      }
    }
    if (messageId) {
      message = await this.messageRepository.findOneBy({ id: messageId });
      if (!message) {
        throw new NotFoundException('Message not found!');
      }
    }
    return (
      user.role === UserRoleEnum.SUPERUSER ||
      user.role === UserRoleEnum.ADMIN ||
      (carId ? car.user_id === userId : message.from_user_id === userId)
    );
  }
}
