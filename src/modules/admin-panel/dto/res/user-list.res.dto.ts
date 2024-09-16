import { ListQueryDto } from '../../../cars/dto/req/list-query.dto';
import { UserResDto } from '../../../users/dto/res/user.res.dto';

export class UserListResDto extends ListQueryDto {
  data: UserResDto[];
  total: number;
}
