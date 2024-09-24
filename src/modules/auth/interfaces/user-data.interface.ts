import { CarEntity } from '../../../database/entities';
import {
  AccountTypeEnum,
  UserRoleEnum,
} from '../../../database/entities/enums';

export interface IUserData {
  userId: string;
  deviceId: string;
  email: string;
  role: UserRoleEnum;
  account: AccountTypeEnum;
  status: boolean;
  cars: CarEntity[];
}
