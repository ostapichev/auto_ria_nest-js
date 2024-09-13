import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BadCountEntity } from './bad-words-count.entity';
import { CarViewsEntity } from './car-views.entity';

import { CarEntity } from './car.entity';
import { AccountTypeEnum } from './enums/account-type.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { UserRoleEnum } from './enums/user-role.enum';
import { MessageEntity } from './message.entity';
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

  @Column('text', { default: UserRoleEnum.BUYER })
  role?: UserRoleEnum;

  @Column('text', { default: AccountTypeEnum.BASIC })
  account?: AccountTypeEnum;

  @Column('float', { default: 0 })
  balance?: number;

  @Column('boolean', { default: true })
  status?: boolean;

  @OneToMany(() => CarEntity, (entity) => entity.user, {
    onDelete: 'CASCADE',
  })
  cars?: CarEntity[];

  @OneToMany(() => MessageEntity, (messages) => messages.from_user, {
    onDelete: 'CASCADE',
  })
  get_messages?: MessageEntity[];

  @OneToMany(() => MessageEntity, (messages) => messages.to_user, {
    onDelete: 'CASCADE',
  })
  send_messages?: MessageEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user, {
    onDelete: 'CASCADE',
  })
  refreshTokens?: RefreshTokenEntity[];

  @OneToOne(() => BadCountEntity, (bad_count) => bad_count.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  bad_count?: BadCountEntity;
}
