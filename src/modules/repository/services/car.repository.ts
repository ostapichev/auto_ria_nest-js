import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarEntity } from '../../../database/entities/car.entity';
import { CarListQueryDto } from '../../cars/dto/req/car-list.query.dto';

@Injectable()
export class CarRepository extends Repository<CarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarEntity, dataSource.manager);
  }

  public async getList(
    userId: string,
    query: CarListQueryDto,
  ): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('car');
    qb.leftJoinAndSelect('car.user', 'user');
    qb.setParameter('userId', userId);
    if (query.search) {
      qb.andWhere('CONCAT(car.brand, article.model) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    qb.orderBy('car.created', 'DESC');
    qb.take(query.limit);
    qb.skip((query.page - 1) * query.limit);
    return await qb.getManyAndCount();
  }

  public async getListAllCars(
    query: CarListQueryDto,
  ): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('car');
    if (query.search) {
      qb.andWhere('CONCAT(car.brand, car.model) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    qb.take(query.limit);
    qb.skip((query.page - 1) * query.limit);
    return await qb.getManyAndCount();
  }

  public async getAVGPrice(): Promise<number> {
    const qb = this.createQueryBuilder('car');
    qb.select('ROUND(AVG(car.price), 2)', 'avgPrice');
    const result = await qb.getRawOne();
    return result.avgPrice;
  }

  public async getAVGPriceCity(cityId: string): Promise<number> {
    const qb = this.createQueryBuilder('car');
    qb.select('ROUND(AVG(car.price), 2)', 'avgPrice');
    qb.where('car.city_id = :cityId', { cityId });
    const result = await qb.getRawOne();
    return result.avgPrice;
  }

  public async getById(userId: string, carId: string): Promise<CarEntity> {
    const qb = this.createQueryBuilder('car');
    qb.leftJoinAndSelect('car.user', 'user');
    qb.setParameter('userId', userId);
    qb.andWhere('car.id = :carId', { carId });
    return await qb.getOneOrFail();
  }
}
