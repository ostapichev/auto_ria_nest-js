import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import {
  AccountTypeEnum,
  GenderEnum,
  TableNameEnum,
  UserRoleEnum,
} from '../enums';
import { BadCountEntity } from './bad-words-count.entity';
import { CarEntity } from './car.entity';
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

  @Column('text', { default: GenderEnum.MALE })
  gender: GenderEnum;

  @Column('text', { default: UserRoleEnum.BUYER })
  role: UserRoleEnum;

  @Column('text', { default: AccountTypeEnum.BASIC })
  account: AccountTypeEnum;

  @Column('float', { default: 0 })
  balance?: number;

  @Column('boolean', { default: false })
  status: boolean;

  @OneToMany(() => CarEntity, (entity) => entity.user)
  cars?: CarEntity[];

  @OneToMany(() => MessageEntity, (messages) => messages.from_user)
  get_messages?: MessageEntity[];

  @OneToMany(() => MessageEntity, (messages) => messages.to_user)
  send_messages?: MessageEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToOne(() => BadCountEntity, (bad_count) => bad_count.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  bad_count?: BadCountEntity;
}
