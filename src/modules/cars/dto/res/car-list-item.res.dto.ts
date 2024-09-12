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
  'price',
  'currency',
  'created',
  'user_id',
]) {}
