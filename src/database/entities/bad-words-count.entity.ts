import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { TableNameEnum } from '../enums';
import { CreateUpdateModel } from './models';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.BAD_WORDS_COUNT)
export class BadCountEntity extends CreateUpdateModel {
  @Column('int', { default: 0 })
  count: number;

  @OneToOne(() => UserEntity, (user) => user.bad_count, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column()
  user_id: string;
}
