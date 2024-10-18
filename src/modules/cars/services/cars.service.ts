import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Between, EntityManager } from 'typeorm';

import {
  BrandCarEntity,
  CarEntity,
  CarViewsEntity,
  CityEntity,
  ModelCarEntity,
  UserEntity,
} from '../../../database/entities';
import {
  AccountTypeEnum,
  ContentType,
  UserRoleEnum,
} from '../../../database/enums';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { BaseCurrencyRateResDto } from '../../currency-rate/dto/res/base-currency-rate.dto';
import { CurrencyRateService } from '../../currency-rate/services/currency-rate.service';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { BrandRepository } from '../../repository/services/brand.repository';
import { CarRepository } from '../../repository/services/car.repository';
import { CarViewsRepository } from '../../repository/services/car-viwes.repository';
import { CityRepository } from '../../repository/services/city.repository';
import { CurrencyRateRepository } from '../../repository/services/currency-rate.repository';
import { ModelRepository } from '../../repository/services/model.repository';
import { CarViewReqDto } from '../dto/req/car-view-req.dto';
import { CityCurrencyQueryDto } from '../dto/req/city-id-req.dto';
import { CreateCarReqDto } from '../dto/req/create-car.dto';
import { ListQueryDto } from '../dto/req/list-query.dto';
import { UpdateCarReqDto } from '../dto/req/update-car.dto';
import { IParams } from '../interfaces/params.interface';

@Injectable()
export class CarsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly carRepository: CarRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly carViesRepository: CarViewsRepository,
    private readonly brandRepository: BrandRepository,
    private readonly modelRepository: ModelRepository,
    private readonly cityRepository: CityRepository,
    private readonly currencyRateRepository: CurrencyRateRepository,
    private readonly currencyRateService: CurrencyRateService,
  ) {}

  public async create(
    userData: IUserData,
    dto: CreateCarReqDto,
    params: IParams,
  ): Promise<CarEntity> {
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      await this.currencyRateService.getExchangeRate();
      const carRepository = em.getRepository(CarEntity);
      const userRepository = em.getRepository(UserEntity);
      const cityRepository = em.getRepository(CityEntity);
      const brandRepository = em.getRepository(BrandCarEntity);
      const modelRepository = em.getRepository(ModelCarEntity);
      const formattedDate = moment().format('YYYY-MM-DD');
      const startDate = moment(formattedDate).startOf('day').toDate();
      const endDate = moment(formattedDate).endOf('day').toDate();
      const currenciesRate = await this.currencyRateRepository.find({
        where: { created: Between(startDate, endDate) },
      });
      const { cityId, brandId, modelId } = params;
      const { cars, userId, role, account } = userData;
      const city = await cityRepository.findOneBy({ id: cityId });
      const brand = await brandRepository.findOneBy({ id: brandId });
      const model = await modelRepository.findOneBy({ id: modelId });
      if (!city || !brand || !model) {
        throw new BadRequestException('Incorrect data!');
      }
      if (cars.length < 1 || account === AccountTypeEnum.PREMIUM) {
        if (role === UserRoleEnum.BUYER) {
          await userRepository.update(userId, {
            role: UserRoleEnum.SELLER,
          });
        }
        return await carRepository.save(
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
    });
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

  public async findOneCar(
    carId: string,
    userData: IUserData,
  ): Promise<CarEntity> {
    return await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const carViesRepository = em.getRepository(CarViewsEntity);
      const car = await this.getCar(carId, em);
      if (userData.userId !== car.user_id) {
        await carViesRepository.save(
          this.carViesRepository.create({
            viewsCount: 1,
            car_id: carId,
          }),
        );
      }
      return car;
    });
  }

  public async uploadPhotoCar(
    photo: Express.Multer.File,
    carId: string,
  ): Promise<void> {
    const image = await this.fileStorageService.uploadFile(
      photo,
      ContentType.CAR,
      carId,
    );
    await this.carRepository.update(carId, { photo: image });
  }

  public async deletePhotoCar(carId: string): Promise<void> {
    const car = await this.getCar(carId);
    if (car.photo) {
      await this.fileStorageService.deleteFile(car.photo);
      await this.carRepository.save(
        this.carRepository.merge(car, { photo: null }),
      );
    }
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
    return await this.brandRepository.getListAllBrands();
  }

  public async getAvgPrice(
    query: CityCurrencyQueryDto,
    currencyData: BaseCurrencyRateResDto[],
  ): Promise<number> {
    const { currency, cityId } = query;
    const cars = await this.carRepository.find({
      where: { city_id: cityId, is_active: true },
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
    const brand = await this.brandRepository.findOneBy({ id: brandId });
    if (!brand) {
      throw new NotFoundException('The brand does not exist!');
    }
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
    if (car.is_active === false) {
      throw new BadRequestException('The car is already not active!');
    }
    await this.carRepository.update(carId, { is_active: false });
  }

  public async activateCar(carId: string): Promise<void> {
    const car = await this.getCar(carId);
    if (car.is_active === true) {
      throw new BadRequestException('The car is already active!');
    }
    await this.carRepository.update(carId, { is_active: true });
  }

  public async removeCar(carId: string): Promise<void> {
    await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const carRepository = em.getRepository(CarEntity);
      await carRepository.delete({ id: carId });
    });
  }

  private async getCar(carId: string, em?: EntityManager): Promise<CarEntity> {
    const car = await this.carRepository.getCar(carId, em);
    if (!car) {
      throw new NotFoundException(`Car not found`);
    }
    return car;
  }

  private findExchangeRate(
    rates: BaseCurrencyRateResDto[],
    currency: string,
  ): number | null {
    const rate = rates.find((rate) => rate.ccy === currency);
    if (rate) {
      return +rate.sale;
    }
    return null;
  }

  private getCurrencyExchangeRate(
    rates: BaseCurrencyRateResDto[],
    fromCurrency: string,
    toCurrency: string,
  ): number | null {
    const fromRate = rates.find((rate) => rate.ccy === fromCurrency);
    const toRate = rates.find((rate) => rate.ccy === toCurrency);
    if (fromRate && toRate) {
      return +fromRate.sale / +toRate.sale;
    }
    return null;
  }
}
