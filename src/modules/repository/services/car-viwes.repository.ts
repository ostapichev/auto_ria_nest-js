import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarViewsEntity } from '../../../database/entities/car-views.entity';

@Injectable()
export class CarViewsRepository extends Repository<CarViewsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarViewsEntity, dataSource.manager);
  }
  // todo fix
  public async getCountViewsDay(carId: string): Promise<number> {
    const qb = this.createQueryBuilder('cont_view_day');
    qb.where('car_views.carId = :carId', { carId });
    qb.andWhere('car_views.created >= CURRENT_DATE');
    const result = await qb.getCount();
    return result;
  }
}
