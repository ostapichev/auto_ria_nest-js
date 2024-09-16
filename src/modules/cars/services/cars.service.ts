import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment-timezone';

import { BrandCarEntity } from '../../../database/entities/brand-car.entity';
import { CarEntity } from '../../../database/entities/car.entity';
import { CarViewsEntity } from '../../../database/entities/car-views.entity';
import { CityEntity } from '../../../database/entities/city.entity';
import { CurrencyRateEntity } from '../../../database/entities/currency-rate.entity';
import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { ModelCarEntity } from '../../../database/entities/model-car.entity';
import { CityCurrencyQueryDto } from '../../admin-panel/dto/req/city-id-req.dto';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { BrandRepository } from '../../repository/services/brand.repository';
import { CarRepository } from '../../repository/services/car.repository';
import { CarViewsRepository } from '../../repository/services/car-viwes.repository';
import { CityRepository } from '../../repository/services/city.repository';
import { ModelRepository } from '../../repository/services/model.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CreateCarReqDto } from '../dto/req/create-car.dto';
import { ListQueryDto } from '../dto/req/list-query.dto';
import { UpdateCarReqDto } from '../dto/req/update-car.dto';
import { IParams } from '../interfaces/params.interface';

@Injectable()
export class CarsService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly carViesRepository: CarViewsRepository,
    private readonly brandRepository: BrandRepository,
    private readonly modelRepository: ModelRepository,
    private readonly userRepository: UserRepository,
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
      userData.cars.length < 1 ||
      userData.account === AccountTypeEnum.PREMIUM
    ) {
      if (userData.role === UserRoleEnum.BUYER) {
        await this.userRepository.update(userData.userId, {
          role: UserRoleEnum.SELLER,
        });
      }
      return await this.carRepository.save(
        this.carRepository.create({
          ...dto,
          update_price: dto.start_price,
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
    query: ListQueryDto,
  ): Promise<[CarEntity[], number]> {
    return await this.carRepository.getList(userData.userId, query);
  }

  public async getListAllCars(
    query: ListQueryDto,
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
  public async getCountViewsDay(carId: string): Promise<number> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const localDateStart = moment
        .tz(startOfDay, 'UTC')
        .tz('Europe/Kyiv')
        .toDate();
      const localDateEnd = moment
        .tz(endOfDay, 'UTC')
        .tz('Europe/Kyiv')
        .toDate();
      const result = await this.carViesRepository
        .createQueryBuilder('car_views')
        .where('car_views.carId = :carId', { carId })
        .andWhere(
          'car_views.created BETWEEN :localDateStart AND :localDateEnd',
          {
            localDateStart,
            localDateEnd,
          },
        )
        .getCount();
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error getting count of views for the day:', error);
      throw new Error('Failed to get count of views for the day');
    }
  }

  public async getListAllCities(): Promise<CityEntity[]> {
    return await this.cityRepository.find();
  }

  public async getListAllBrands(): Promise<BrandCarEntity[]> {
    return await this.brandRepository.find({
      relations: { models: true },
    });
  }

  public async getAvgPrice(
    query: CityCurrencyQueryDto,
    currencyData: CurrencyRateEntity[],
  ): Promise<number> {
    const { currency, cityId } = query;
    const cars = await this.carRepository.find({
      where: { city_id: cityId, active: true },
    });
    const totalPrice = cars.reduce((sum, car) => {
      let price = car.update_price;
      const exchangeRateFrom = this.findExchangeRate(
        currencyData,
        car.currency,
      );
      const exchangeRateTo = this.findExchangeRate(currencyData, currency);
      if (exchangeRateFrom && exchangeRateTo) {
        const rate = this.getCurrencyExchangeRate(
          currencyData,
          car.currency,
          currency,
        );
        price *= rate;
      } else if (exchangeRateFrom && !exchangeRateTo) {
        price *= exchangeRateFrom;
      } else if (!exchangeRateFrom && exchangeRateTo) {
        price /= exchangeRateTo;
      }
      return sum + price;
    }, 0);
    return +(totalPrice / cars.length).toFixed(2);
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

  public async deActivateCar(carId: string): Promise<void> {
    const car = await this.getCar(carId);
    if (car.active === false) {
      throw new BadRequestException('The car is already not active!');
    }
    await this.carRepository.update(carId, { active: false });
  }

  public async activateCar(carId: string): Promise<void> {
    const car = await this.getCar(carId);
    if (car.active === true) {
      throw new BadRequestException('The car is already active!');
    }
    await this.carRepository.update(carId, { active: true });
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

  private findExchangeRate(
    rates: CurrencyRateEntity[],
    currency: string,
  ): number | null {
    const rate = rates.find((rate) => rate.ccy === currency);
    if (rate) {
      return rate.sale;
    }
    return null;
  }

  private getCurrencyExchangeRate(
    rates: CurrencyRateEntity[],
    fromCurrency: string,
    toCurrency: string,
  ): number | null {
    const fromRate = rates.find((rate) => rate.ccy === fromCurrency);
    const toRate = rates.find((rate) => rate.ccy === toCurrency);
    if (fromRate && toRate) {
      return fromRate.sale / toRate.sale;
    }
    return null;
  }
}
