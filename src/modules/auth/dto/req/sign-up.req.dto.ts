import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpReqDto extends PickType(BaseAuthReqDto, [
  'image',
  'name',
  'phone',
  'email',
  'password',
  'deviceId',
  'role',
  'account',
]) {}
