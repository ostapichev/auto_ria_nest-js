import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarViewsEntity } from '../../../database/entities';

@Injectable()
export class CarViewsRepository extends Repository<CarViewsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarViewsEntity, dataSource.manager);
  }

  public async getCountViewsDay(carId: string): Promise<number> {
    const qb = this.createQueryBuilder('cont_view_day');
    qb.where('car_views.carId = :carId', { carId });
    qb.andWhere('car_views.created >= new Date()');
    return await qb.getCount();
  }
}
