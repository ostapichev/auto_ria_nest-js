import { PickType } from '@nestjs/swagger';

import { BaseCarResDto } from './base-car.res.dto';

export class CarUpdateResDto extends PickType(BaseCarResDto, [
  'id',
  'photo',
  'title',
  'description',
  'color',
  'start_price',
  'update_price',
  'currency',
  'year',
  'active',
  'created',
  'updated',
  'user_id',
]) {}
