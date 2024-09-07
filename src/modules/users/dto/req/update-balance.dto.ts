import { PickType } from '@nestjs/swagger';

import { BaseUserReqDto } from './base-user.req.dto';

export class UpdateBalanceDto extends PickType(BaseUserReqDto, ['balance']) {}
