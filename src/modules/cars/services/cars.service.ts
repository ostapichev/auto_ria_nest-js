import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BrandCarEntity } from '../../../database/entities/brand-car.entity';
import { CarEntity } from '../../../database/entities/car.entity';
import { CarViewsEntity } from '../../../database/entities/car-views.entity';
import { CityEntity } from '../../../database/entities/city.entity';
import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';
import { ModelCarEntity } from '../../../database/entities/model-car.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { BrandRepository } from '../../repository/services/brand.repository';
import { CarRepository } from '../../repository/services/car.repository';
import { CarViewsRepository } from '../../repository/services/car-viwes.repository';
import { CityRepository } from '../../repository/services/city.repository';
import { ModelRepository } from '../../repository/services/model.repository';
import { CarListQueryDto } from '../dto/req/car-list.query.dto';
import { CreateCarReqDto } from '../dto/req/create-car.dto';
import { UpdateCarReqDto } from '../dto/req/update-car.dto';
import { IParams } from '../interfaces/params.interface';

@Injectable()
export class CarsService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly carViesRepository: CarViewsRepository,
    private readonly brandRepository: BrandRepository,
    private readonly modelRepository: ModelRepository,
    private readonly cityRepository: CityRepository,
  ) {}

  public async create(
    userData: IUserData,
    dto: CreateCarReqDto,
    params: IParams,
  ): Promise<CarEntity> {
    const city = await this.cityRepository.findOneBy({ id: params.cityId });
    const brand = await this.brandRepository.findOneBy({ id: params.brandId });
    const model = await this.modelRepository.findOneBy({ id: params.modelId });
    if (!city || !brand || !model) {
      throw new BadRequestException('Incorrect data!');
    }
    if (
      userData.cars.length > 1 ||
      userData.account === AccountTypeEnum.PREMIUM
    ) {
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
    throw new ForbiddenException('Buy premium!');
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

  // todo fix
  public async getCountViewsDay(carId: string): Promise<any> {
    const [, countViews] = await this.getCarContViews(carId);
    await this.carViesRepository.getCountViewsDay(carId);
  }

  public async getListAllCities(): Promise<CityEntity[]> {
    return await this.cityRepository.find();
  }

  public async getListAllBrands(): Promise<BrandCarEntity[]> {
    return await this.brandRepository.find({
      relations: { models: true },
    });
  }

  public async getAvgPrice(): Promise<number> {
    return await this.carRepository.getAVGPrice();
  }

  public async getAvgPriceCity(cityId: string): Promise<number> {
    return await this.carRepository.getAVGPriceCity(cityId);
  }

  public async getListAllModels(brandId: string): Promise<ModelCarEntity[]> {
    return await this.modelRepository.find({
      where: { brand_id: brandId },
    });
  }

  public async updateCar(
    carId: string,
    dto: UpdateCarReqDto,
  ): Promise<CarEntity> {
    const car = await this.getCar(carId);
    this.carRepository.merge(car, dto);
    return await this.carRepository.save(car);
  }

  public async removeCar(carId: string): Promise<void> {
    await this.carRepository.delete({ id: carId });
  }

  private async getCarContViews(
    carId: string,
  ): Promise<[CarEntity, CarViewsEntity]> {
    const car = await this.getCar(carId);
    const countView = await this.carViesRepository.findOneBy({ car_id: carId });
    if (!countView) {
      await this.carViesRepository.save(
        this.carViesRepository.create({
          car_id: carId,
        }),
      );
    }
    return [car, countView];
  }

  private async getCar(carId: string): Promise<CarEntity> {
    const car = await this.carRepository.findOneBy({ id: carId });
    if (!car) {
      throw new NotFoundException(`Car with id ${carId} not found`);
    }
    return car;
  }
}
