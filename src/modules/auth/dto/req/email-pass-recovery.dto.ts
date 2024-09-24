import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base-auth.req.dto';

export class EmailPassRecoveryDto extends PickType(BaseAuthReqDto, [
  'email',
  'deviceId',
]) {}
