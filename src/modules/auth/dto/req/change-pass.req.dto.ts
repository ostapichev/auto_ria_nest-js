import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base-auth.req.dto';

export class ChangePassReqDto extends PickType(BaseAuthReqDto, [
  'password',
  'deviceId',
]) {}
