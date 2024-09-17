import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { Between } from 'typeorm';

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
import { CurrencyRateRepository } from '../../repository/services/currency-rate.repository';
import { ModelRepository } from '../../repository/services/model.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CarViewReqDto } from '../dto/req/car-view-req.dto';
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
    private readonly currencyRateRepository: CurrencyRateRepository,
  ) {}

  public async create(
    userData: IUserData,
    dto: CreateCarReqDto,
    params: IParams,
  ): Promise<CarEntity> {
    const formattedDate = moment().format('YYYY-MM-DD');
    const startDate = moment(formattedDate).startOf('day').toDate();
    const endDate = moment(formattedDate).endOf('day').toDate();
    const currenciesRate = await this.currencyRateRepository.find({
      where: { created: Between(startDate, endDate) },
    });
    const { cityId, brandId, modelId } = params;
    const { cars, userId, role, account } = userData;
    const city = await this.cityRepository.findOneBy({ id: cityId });
    const brand = await this.brandRepository.findOneBy({ id: brandId });
    const model = await this.modelRepository.findOneBy({ id: modelId });
    if (!city || !brand || !model) {
      throw new BadRequestException('Incorrect data!');
    }
    if (cars.length < 1 || account === AccountTypeEnum.PREMIUM) {
      if (role === UserRoleEnum.BUYER) {
        await this.userRepository.update(userId, {
          role: UserRoleEnum.SELLER,
        });
      }
      return await this.carRepository.save(
        this.carRepository.create({
          ...dto,
          update_price: dto.start_price,
          user_id: userId,
          city_id: cityId,
          brand_id: brandId,
          model_id: modelId,
          start_currencies_rate: currenciesRate,
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
    const car = await this.getCar(carId);
    await this.carViesRepository.save(
      this.carViesRepository.create({
        viewsCount: 1,
        car_id: carId,
      }),
    );
    return car;
  }

  public async getCountViews(query: CarViewReqDto): Promise<number> {
    let views: CarViewsEntity[];
    const { carId, day } = query;
    const car = await this.getCar(carId);
    if (day) {
      const startDate = new Date();
      const endDate = new Date();
      startDate.setDate(startDate.getDate() - day);
      views = await this.carViesRepository.find({
        where: { car_id: car.id, created: Between(startDate, endDate) },
      });
    } else {
      views = await this.carViesRepository.find({
        where: { car_id: car.id },
      });
    }
    return views.reduce((acc, obj) => acc + obj.viewsCount, 0);
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
