import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BrandCarEntity } from '../../../database/entities/brand-car.entity';

@Injectable()
export class BrandRepository extends Repository<BrandCarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BrandCarEntity, dataSource.manager);
  }
}
