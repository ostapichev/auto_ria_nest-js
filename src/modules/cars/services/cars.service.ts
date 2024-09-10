import { Injectable, NotFoundException } from '@nestjs/common';

import { CarEntity } from '../../../database/entities/car.entity';
import { CarViewsEntity } from '../../../database/entities/car-views.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CarRepository } from '../../repository/services/car.repository';
import { CarViewsRepository } from '../../repository/services/car-viwes.repository';
import { CarListQueryDto } from '../dto/req/car-list.query.dto';
import { CreateCarReqDto } from '../dto/req/create-car.dto';
import { UpdateCarDto } from '../dto/req/update-car.dto';
import { IParams } from '../interfaces/params.interface';

@Injectable()
export class CarsService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly carViesRepository: CarViewsRepository,
  ) {}

  public async create(
    userData: IUserData,
    dto: CreateCarReqDto,
    params: IParams
  ): Promise<CarEntity> {
    return await this.carRepository.save(
      this.carRepository.create({
        ...dto,
        user_id: userData.userId,
        city_id: params.cityId,
        brand_id: params.brandId,
        model_id: params.modelId,
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

  public async findOneCar(carId: string): Promise<CarEntity> {
    const [car] = await this.getCarContViews(carId);
    await this.carViesRepository.increment({ car_id: carId }, 'viewsCount', 1);
    return car;
  }

  public async getCountViews(carId: string): Promise<number> {
    const [, countViews] = await this.getCarContViews(carId);
    return countViews.viewsCount;
  }

  public async updateCar(carId: string, updateCarDto: UpdateCarDto) {}

  remove(id: number) {
    return `This action removes a #${id} car`;
  }

  private async getCarContViews(
    carId: string,
  ): Promise<[CarEntity, CarViewsEntity]> {
    const car = await this.carRepository.findOneBy({ id: carId });
    const countView = await this.carViesRepository.findOneBy({ car_id: carId });
    if (!car) {
      throw new NotFoundException(`Car with id ${carId} not found`);
    }
    if (!countView) {
      await this.carViesRepository.save(
        this.carViesRepository.create({
          car_id: carId,
        }),
      );
    }
    return [car, countView];
  }
}
