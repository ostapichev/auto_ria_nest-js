import { PickType } from '@nestjs/swagger';

import { BaseCarReqDto } from './base-car.req.dto';

export class UpdateCarReqDto extends PickType(BaseCarReqDto, [
  'title',
  'description',
  'update_price',
  'currency',
  'color',
  'year',
]) {}
