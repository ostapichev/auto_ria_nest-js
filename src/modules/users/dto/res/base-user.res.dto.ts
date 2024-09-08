import { AccountTypeEnum } from '../../../../database/entities/enums/account-type.enum';
import { UserRoleEnum } from '../../../../database/entities/enums/user-role.enum';

export class BaseUserResDto {
  id: string;
  image?: string;
  name: string;
  phone: string;
  email: string;
  role: UserRoleEnum;
  account: AccountTypeEnum;
  balance?: number;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
