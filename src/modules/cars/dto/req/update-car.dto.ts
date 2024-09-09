import { PartialType } from '@nestjs/swagger';

import { CreateCarReqDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarReqDto) {}
