import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarViewsEntity } from '../../../database/entities/car-views.entity';

@Injectable()
export class CarViewsRepository extends Repository<CarViewsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarViewsEntity, dataSource.manager);
  }
}
