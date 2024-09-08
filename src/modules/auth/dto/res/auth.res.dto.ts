import { SuperUserResDto } from '../../../users/dto/res/super-user.dto';
import { UserResDto } from '../../../users/dto/res/user.res.dto';
import { TokenPairResDto } from './token-pair.res.dto';

export class AuthResDto {
  tokens: TokenPairResDto;
  user: UserResDto;
}

export class AuthSuperUserResDto {
  tokens: TokenPairResDto;
  user: SuperUserResDto;
}
