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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiFile } from '../../common';
import {
  BrandCarEntity,
  CityEntity,
  ModelCarEntity,
} from '../../database/entities';
import { CityCurrencyQueryDto } from '../admin-panel/dto/req/city-id-req.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CurrencyRateService } from '../currency-rate/services/currency-rate.service';
import { CarViewReqDto } from './dto/req/car-view-req.dto';
import { CreateCarReqDto } from './dto/req/create-car.dto';
import { ListQueryDto } from './dto/req/list-query.dto';
import { UpdateCarReqDto } from './dto/req/update-car.dto';
import { CarListResDto } from './dto/res/car-list.res.dto';
import { CarListItemResDto } from './dto/res/car-list-item.res.dto';
import { CarUpdateResDto } from './dto/res/car-update-res.dto';
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

  @ApiOperation({ description: 'Create new car' })
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

  @ApiOperation({ description: 'Get list all cars' })
  @SkipAuth()
  @Get()
  public async getListAllCars(
    @Query() query: ListQueryDto,
  ): Promise<CarListResDto> {
    const [entities, total] = await this.carsService.getListAllCars(query);
    return CarMapper.toResponseListDTO(entities, total, query);
  }

  @ApiOperation({ description: 'Get list all cars in the city' })
  @SkipAuth()
  @Get('city/:cityId')
  public async getListCarsCity(
    @Query() query: ListQueryDto,
    @Param('cityId', ParseUUIDPipe) cityId: string,
  ): Promise<CarListResDto> {
    const [entities, total] = await this.carsService.getListCarsCity(
      cityId,
      query,
    );
    return CarMapper.toResponseListDTO(entities, total, query);
  }

  @ApiOperation({ description: 'Get list all cars from the user' })
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

  @ApiOperation({ description: 'Get list all cities' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('cities')
  public async getListAllCities(): Promise<CityEntity[]> {
    return await this.carsService.getListAllCities();
  }

  @ApiOperation({ description: 'Get list all brands' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('brands')
  public async getListAllBrands(): Promise<BrandCarEntity[]> {
    return await this.carsService.getListAllBrands();
  }

  @ApiOperation({
    description:
      'Get avg price in the city or the all cities. Only for users with premium account',
  })
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

  @ApiOperation({ description: 'Get list models in the brand' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get(':brandId/models')
  public async getListAllModels(
    @Param('brandId', ParseUUIDPipe) brandId: string,
  ): Promise<ModelCarEntity[]> {
    return await this.carsService.getListAllModels(brandId);
  }

  @ApiOperation({ description: 'Get car by id.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get(':carId')
  public async findOneCar(
    @Param('carId', ParseUUIDPipe) carId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<CarListItemResDto> {
    const result = await this.carsService.findOneCar(carId, userData);
    return CarMapper.toResponseListItemDTO(result);
  }

  @ApiOperation({ description: 'Update car by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthorGuard)
  @Put(':carId')
  public async update(
    @Param('carId', ParseUUIDPipe) carId: string,
    @Body() dto: UpdateCarReqDto,
  ): Promise<CarUpdateResDto> {
    const result = await this.carsService.updateCar(carId, dto);
    return CarMapper.toResponseUpdateDTO(result);
  }

  @ApiOperation({ description: 'Add photo for the car' })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('car-photo'))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiFile('car-photo', false, false)
  @UseGuards(AuthorGuard)
  @Post(':carId/car-photo')
  public async uploadPhotoCar(
    @Param('carId', ParseUUIDPipe) carId: string,
    @UploadedFile() carPhoto: Express.Multer.File,
  ): Promise<void> {
    await this.carsService.uploadPhotoCar(carPhoto, carId);
  }

  @ApiOperation({ description: 'Delete photo for the car' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthorGuard)
  @Delete(':carId/car-photo')
  public async deleteAvatar(
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<void> {
    await this.carsService.deletePhotoCar(carId);
  }

  @ApiOperation({ description: 'Delete car by id' })
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

  @ApiOperation({
    description: 'Get views car by id. Only for users with premium account',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(PremiumGuard)
  @Get('views/:carId/:day?')
  public async getCountViews(@Query() query: CarViewReqDto): Promise<number> {
    return await this.carsService.getCountViews(query);
  }

  @ApiOperation({ description: 'Deactivate car by id' })
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

  @ApiOperation({ description: 'Activate car by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthorGuard)
  @Patch('activate/:carId')
  async activate(@Param('carId', ParseUUIDPipe) carId: string): Promise<void> {
    return await this.carsService.activateCar(carId);
  }
}
