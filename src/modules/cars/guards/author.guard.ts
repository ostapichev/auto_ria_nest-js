import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';
import { CarRepository } from '../../repository/services/car.repository';
import { CarsService } from '../services/cars.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly carsService: CarsService,
    private readonly carRepository: CarRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    const { userId } = request.user;
    const { carId } = request.params;
    const car = await this.carRepository.findOneBy({ id: carId });
    return (
      (car && user && user.role === 'superuser') ||
      user.role === 'admin' ||
      car.user_id === userId
    );
  }
}
