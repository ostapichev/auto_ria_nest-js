import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BrandCarEntity } from '../../database/entities/brand-car.entity';
import { CityEntity } from '../../database/entities/city.entity';
import { ModelCarEntity } from '../../database/entities/model-car.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarListQueryDto } from './dto/req/car-list.query.dto';
import { CreateCarReqDto } from './dto/req/create-car.dto';
import { UpdateCarReqDto } from './dto/req/update-car.dto';
import { CarResDto } from './dto/res/car.res.dto';
import { CarListResDto } from './dto/res/car-list.res.dto';
import { CarListItemResDto } from './dto/res/car-list-item.res.dto';
import { AuthorGuard } from './guards/author.guard';
import { PremiumGuard } from './guards/premium.guard';
import { CarMapper } from './services/car.mapper';
import { CarsService } from './services/cars.service';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService,) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Post(':cityId/:brandId/:modelId')
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarReqDto,
    @Param('cityId', ParseUUIDPipe) cityId: string,
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('modelId', ParseUUIDPipe) modelId: string,
  ): Promise<CreateCarReqDto> {
    const params = { cityId, brandId, modelId };
    const exchangeRate = await this.carsService.getExchangeRate();
    console.log(exchangeRate.data[0]);
    const result = await this.carsService.create(userData, dto, params);
    return CarMapper.toResponseDTO(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('user_car')
  public async getListCarsUser(
    @CurrentUser() userData: IUserData,
    @Query() query: CarListQueryDto,
  ): Promise<CarListResDto> {
    const [entities, total] = await this.carsService.getListCarsUser(
      userData,
      query,
    );
    return CarMapper.toResponseListDTO(entities, total, query);
  }

  @SkipAuth()
  @Get()
  public async getListAllCars(
    @Query() query: CarListQueryDto,
  ): Promise<CarListResDto> {
    const [entities, total] = await this.carsService.getListAllCars(query);
    return CarMapper.toResponseListDTO(entities, total, query);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('cities')
  public async getListAllCities(): Promise<CityEntity[]> {
    return await this.carsService.getListAllCities();
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('brands')
  public async getListAllBrands(): Promise<BrandCarEntity[]> {
    return await this.carsService.getListAllBrands();
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(PremiumGuard)
  @Get('avg_price')
  public async getAvgPrice(): Promise<number> {
    return await this.carsService.getAvgPrice();
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get(':brandId/models')
  public async getListAllModels(
    @Param('brandId', ParseUUIDPipe) brandId: string,
  ): Promise<ModelCarEntity[]> {
    return await this.carsService.getListAllModels(brandId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get(':carId')
  public async findOneCar(
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<CarListItemResDto> {
    const result = await this.carsService.findOneCar(carId);
    return CarMapper.toResponseListItemDTO(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthorGuard)
  @Put(':carId')
  public async update(
    @Param('carId', ParseUUIDPipe) carId: string,
    @Body() dto: UpdateCarReqDto,
  ): Promise<CarResDto> {
    const result = await this.carsService.updateCar(carId, dto);
    return CarMapper.toResponseDTO(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthorGuard)
  @Delete(':carId')
  remove(@Param('carId', ParseUUIDPipe) carId: string): Promise<void> {
    return this.carsService.removeCar(carId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(PremiumGuard)
  @Get(':carId/views')
  public async getCountViews(
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<number> {
    return await this.carsService.getCountViews(carId);
  }

  // todo fix
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(PremiumGuard)
  @Get(':carId/views_day')
  public async getCountViewsDay(
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<number> {
    return await this.carsService.getCountViewsDay(carId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(PremiumGuard)
  @Get(':cityId/avg_price_city')
  public async getAvgPriceCity(
    @Param('cityId', ParseUUIDPipe) cityId: string,
  ): Promise<number> {
    return await this.carsService.getAvgPriceCity(cityId);
  }
}
