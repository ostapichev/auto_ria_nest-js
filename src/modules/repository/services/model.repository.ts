import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ModelCarEntity } from '../../../database/entities';

@Injectable()
export class ModelRepository extends Repository<ModelCarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ModelCarEntity, dataSource.manager);
  }
}
