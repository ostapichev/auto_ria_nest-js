import { Column, Entity, OneToMany } from 'typeorm';

import { CarEntity } from './car.entity';
import { AccountTypeEnum } from './enums/account-type.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { UserRoleEnum } from './enums/user-role.enum';
import { CreateUpdateModel } from './models';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity(TableNameEnum.USERS)
export class UserEntity extends CreateUpdateModel {
  @Column('text', { nullable: true })
  image?: string;

  @Column('text')
  name: string;

  @Column('text', { unique: true })
  phone: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  role?: UserRoleEnum;

  @Column('text')
  account?: AccountTypeEnum;

  @Column('float', { nullable: true })
  balance?: number | null;

  @Column('boolean')
  status?: boolean;

  @OneToMany(() => CarEntity, (entity) => entity.user)
  cars?: CarEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
}
