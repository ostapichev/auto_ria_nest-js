import { Injectable } from '@nestjs/common';

import { CarEntity } from '../../../database/entities/car.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CarRepository } from '../../repository/services/car.repository';
import { CarListQueryDto } from '../dto/req/car-list.query.dto';
import { CreateCarReqDto } from '../dto/req/create-car.dto';
import { UpdateCarDto } from '../dto/req/update-car.dto';

@Injectable()
export class CarsService {
  constructor(private readonly carRepository: CarRepository) {}

  public async create(
    userData: IUserData,
    dto: CreateCarReqDto,
  ): Promise<CarEntity> {
    return await this.carRepository.save(
      this.carRepository.create({
        ...dto,
        user_id: userData.userId,
        active: true,
      }),
    );
  }

  public async getListCarsUser(
    userData: IUserData,
    query: CarListQueryDto,
  ): Promise<[CarEntity[], number]> {
    return await this.carRepository.getList(userData.userId, query);
  }

  public async getListAllCars(
    query: CarListQueryDto,
  ): Promise<[CarEntity[], number]> {
    return await this.carRepository.getListAllCars(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
