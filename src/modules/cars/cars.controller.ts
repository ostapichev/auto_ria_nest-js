import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarListQueryDto } from './dto/req/car-list.query.dto';
import { CreateCarReqDto } from './dto/req/create-car.dto';
import { UpdateCarDto } from './dto/req/update-car.dto';
import { CarListResDto } from './dto/res/car-list.res.dto';
import { CarMapper } from './services/car.mapper';
import { CarsService } from './services/cars.service';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Post()
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarReqDto,
  ): Promise<CreateCarReqDto> {
    const result = await this.carsService.create(userData, dto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }
}
