import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

import { UserEntity } from '../../../database/entities/user.entity';
import { CarRepository } from '../../repository/services/car.repository';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(private readonly carRepository: CarRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    const { userId } = request.user;
    const { carId } = request.params;
    if (!isUUID(carId)) {
      throw new BadRequestException('Invalid car ID format!');
    }
    const car = await this.carRepository.findOneBy({ id: carId });
    if (!car) {
      throw new NotFoundException('The car not found!');
    }
    return (
      (car && user && user.role === 'superuser') ||
      user.role === 'admin' ||
      car.user_id === userId
    );
  }
}
