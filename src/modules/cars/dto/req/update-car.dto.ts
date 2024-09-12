import { PickType } from '@nestjs/swagger';

import { BaseCarReqDto } from './base-car.req.dto';

export class UpdateCarReqDto extends PickType(BaseCarReqDto, [
  'photo',
  'title',
  'description',
  'price',
  'currency',
  'color',
  'year',
]) {}
