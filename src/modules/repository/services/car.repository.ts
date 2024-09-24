import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

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
    qb.leftJoinAndSelect('car.start_currencies_rate', 'currency_rate');
    qb.leftJoinAndSelect('car.user', 'user');
    qb.where('car.user_id = :userId', { userId });
    if (query.search) {
      qb.andWhere('CONCAT(car.brand, car.model) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    qb.orderBy('car.created', 'DESC');
    qb.take(query.limit);
    qb.skip((query.page - 1) * query.limit);
    return await qb.getManyAndCount();
  }

  public async getListAllCars(
    query: ListQueryDto,
  ): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('car');
    qb.leftJoinAndSelect('car.start_currencies_rate', 'currency_rate');
    qb.andWhere('car.active != :active', { active: false });
    if (query.search) {
      qb.andWhere('CONCAT(car.title, car.description) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    qb.take(query.limit);
    qb.skip((query.page - 1) * query.limit);
    return await qb.getManyAndCount();
  }

  public async getCar(carId: string): Promise<CarEntity> {
    const qb = this.createQueryBuilder('car');
    qb.where('car.id = :carId', { carId });
    qb.leftJoinAndSelect('car.start_currencies_rate', 'currency_rate');
    return await qb.getOne();
  }
}
