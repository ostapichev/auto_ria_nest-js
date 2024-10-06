import { PickType } from '@nestjs/swagger';

import { BaseCarResDto } from './base-car.res.dto';

export class CarListItemResDto extends PickType(BaseCarResDto, [
  'id',
  'photo',
  'title',
  'description',
  'city',
  'brand',
  'model',
  'color',
  'start_price',
  'update_price',
  'currency',
  'created',
  'start_currencies_rate',
  'user_id',
]) {}
