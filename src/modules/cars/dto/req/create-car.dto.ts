import { PickType } from '@nestjs/swagger';

import { BaseCarReqDto } from './base-car.req.dto';

export class CreateCarReqDto extends PickType(BaseCarReqDto, [
  'photo',
  'title',
  'description',
  'color',
  'price',
  'year',
]) {}
