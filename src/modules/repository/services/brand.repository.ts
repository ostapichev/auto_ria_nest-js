import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BrandCarEntity } from '../../../database/entities';

@Injectable()
export class BrandRepository extends Repository<BrandCarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BrandCarEntity, dataSource.manager);
  }

  public async getListAllBrands(): Promise<BrandCarEntity[]> {
    const qb = this.createQueryBuilder('brand');
    qb.orderBy('brand.created', 'DESC');
    qb.leftJoinAndSelect('brand.models', 'model');
    return await qb.getMany();
  }
}
