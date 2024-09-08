import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export interface IUserData {
  userId: string;
  deviceId: string;
  email: string;
  role: UserRoleEnum;
  account: AccountTypeEnum;
}
