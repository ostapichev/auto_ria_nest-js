import { PickType } from '@nestjs/swagger';

import { BaseCarResDto } from './base-car.res.dto';

export class CarResDto extends PickType(BaseCarResDto, [
  'id',
  'photo',
  'title',
  'description',
  'color',
  'price',
  'year',
  'count_view',
  'active',
  'created',
  'updated',
  'user_id',
]) {}
