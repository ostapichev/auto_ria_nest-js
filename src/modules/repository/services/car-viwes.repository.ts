import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarViewsEntity } from '../../../database/entities';
import { CarViewReqDto } from '../../cars/dto/req/car-view-req.dto';

@Injectable()
export class CarViewsRepository extends Repository<CarViewsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarViewsEntity, dataSource.manager);
  }

  public async getCountViews(query: CarViewReqDto): Promise<number> {
    const { carId, day } = query;
    const currentDate = new Date();
    const startDate = currentDate.setDate(currentDate.getDate() - day);
    const qb = this.createQueryBuilder('view');
    if (day) {
      qb.where('view.car_id = :carId', { carId });
      qb.andWhere('view.created >= :startOfDay', {
        startOfDay: new Date(startDate),
      });
      qb.andWhere('view.created < :endOfDay', {
        endOfDay: new Date(),
      });
    } else {
      qb.andWhere('view.car_id = :carId', { carId });
    }
    return await qb.getCount();
  }
}
