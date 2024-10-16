import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { CarEntity } from '../../../database/entities';
import { ListQueryDto } from '../../cars/dto/req/list-query.dto';

@Injectable()
export class CarRepository extends Repository<CarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarEntity, dataSource.manager);
  }

  public async getList(
    userId: string,
    query: ListQueryDto,
  ): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('car');
    qb.where('car.user_id = :userId', { userId });
    return await this.qbHelper(qb, query);
  }

  public async getListAllCars(
    query: ListQueryDto,
  ): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('car');
    qb.andWhere('car.is_active != :is_active', { is_active: false });
    if (query.cityId) {
      qb.andWhere('car.city_id = :cityId', { cityId: query.cityId });
    }
    return await this.qbHelper(qb, query);
  }

  public async getCar(carId: string): Promise<CarEntity> {
    const qb = this.createQueryBuilder('car');
    qb.where('car.id = :carId', { carId });
    qb.leftJoinAndSelect('car.start_currencies_rate', 'currency_rate');
    return await qb.getOne();
  }

  private async qbHelper(
    qb: SelectQueryBuilder<CarEntity>,
    query: ListQueryDto,
  ): Promise<[CarEntity[], number]> {
    if (query.search) {
      qb.andWhere('CONCAT(car.id, car.title, car.description) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    qb.leftJoinAndSelect('car.start_currencies_rate', 'currency_rate');
    qb.leftJoinAndSelect('car.user', 'user');
    qb.orderBy('car.created', 'DESC');
    qb.take(query.limit);
    qb.skip((query.page - 1) * query.limit);
    return await qb.getManyAndCount();
  }
}
