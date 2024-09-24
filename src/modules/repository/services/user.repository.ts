import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from '../../../database/entities';
import { ListQueryDto } from '../../cars/dto/req/list-query.dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async getListAllUsers(
    query: ListQueryDto,
  ): Promise<[UserEntity[], number]> {
    const qb = this.createQueryBuilder('user');
    qb.leftJoinAndSelect('user.cars', 'car');
    qb.andWhere('user.role != :role', { role: 'superuser' });
    if (query.search) {
      qb.andWhere('CONCAT(user.name, user.email) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    qb.take(query.limit);
    qb.skip((query.page - 1) * query.limit);
    return await qb.getManyAndCount();
  }

  public async getByIdUser(userId: string): Promise<UserEntity> {
    const qb = this.createQueryBuilder('user');
    qb.where('user.id = :userId', { userId });
    qb.leftJoinAndSelect('user.cars', 'car');
    return await qb.getOne();
  }
}
