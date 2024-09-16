import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { CityCurrencyQueryDto } from '../admin-panel/dto/req/city-id-req.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CurrencyRateService } from '../currency-rate/services/currency-rate.service';
import { CreateCarReqDto } from './dto/req/create-car.dto';
import { ListQueryDto } from './dto/req/list-query.dto';
import { UpdateCarReqDto } from './dto/req/update-car.dto';
import { CarResDto } from './dto/res/car.res.dto';
import { CarListResDto } from './dto/res/car-list.res.dto';
import { CarListItemResDto } from './dto/res/car-list-item.res.dto';
import { AuthorGuard } from './guards/author.guard';
import { BadWordsGuard } from './guards/bad-words.guard';
import { PremiumGuard } from './guards/premium.guard';
import { CarMapper } from './services/car.mapper';
import { CarsService } from './services/cars.service';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(
    private readonly carsService: CarsService,
    private readonly currencyCourseService: CurrencyRateService,
  ) {}

  @SkipAuth()
  @Get()
  public async getListAllCars(
    @Query() query: ListQueryDto,
  ): Promise<CarListResDto> {
    const [entities, total] = await this.carsService.getListAllCars(query);
    return CarMapper.toResponseListDTO(entities, total, query);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(BadWordsGuard)
  @Post(':cityId/:brandId/:modelId')
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarReqDto,
    @Param('cityId', ParseUUIDPipe) cityId: string,
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('modelId', ParseUUIDPipe) modelId: string,
  ): Promise<CreateCarReqDto> {
    const params = { cityId, brandId, modelId };
    const result = await this.carsService.create(userData, dto, params);
    return CarMapper.toResponseDTO(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('user-car')
  public async getListCarsUser(
    @CurrentUser() userData: IUserData,
    @Query() query: ListQueryDto,
  ): Promise<CarListResDto> {
    const [entities, total] = await this.carsService.getListCarsUser(
      userData,
      query,
    );
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
  public async getAvgPrice(
    @Query() query: CityCurrencyQueryDto,
  ): Promise<number> {
    const currencies = await this.currencyCourseService.getExchangeRate();
    return await this.carsService.getAvgPrice(query, currencies);
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
  public async remove(
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<void> {
    return await this.carsService.removeCar(carId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(PremiumGuard)
  @Get('views/:carId')
  public async getCountViews(
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<number> {
    return await this.carsService.getCountViews(carId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthorGuard)
  @Patch('deActivate/:carId')
  async deActivate(
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<void> {
    return await this.carsService.deActivateCar(carId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthorGuard)
  @Patch('activate/:carId')
  async activate(@Param('carId', ParseUUIDPipe) carId: string): Promise<void> {
    return await this.carsService.activateCar(carId);
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
}
