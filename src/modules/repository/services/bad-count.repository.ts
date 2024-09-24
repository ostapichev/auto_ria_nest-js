import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BadCountEntity } from '../../../database/entities';

@Injectable()
export class BadCountRepository extends Repository<BadCountEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BadCountEntity, dataSource.manager);
  }
}
