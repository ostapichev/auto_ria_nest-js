import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarViewsEntity } from '../../../database/entities';

@Injectable()
export class CarViewsRepository extends Repository<CarViewsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarViewsEntity, dataSource.manager);
  }
}
