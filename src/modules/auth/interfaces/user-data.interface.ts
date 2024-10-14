import { CarEntity } from '../../../database/entities';
import {
  AccountTypeEnum,
  GenderEnum,
  UserRoleEnum,
} from '../../../database/enums';

export interface IUserData {
  userId: string;
  deviceId: string;
  email: string;
  role: UserRoleEnum;
  gender: GenderEnum;
  account: AccountTypeEnum;
  status: boolean;
  cars: CarEntity[];
}
