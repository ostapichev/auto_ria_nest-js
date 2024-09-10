import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CityEntity } from '../../../database/entities/city.entity';

@Injectable()
export class CityRepository extends Repository<CityEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CityEntity, dataSource.manager);
  }
}
