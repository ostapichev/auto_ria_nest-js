import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from '../enums';
import { CreateUpdateModel } from './models';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.MESSAGES)
export class MessageEntity extends CreateUpdateModel {
  @Column('text')
  content: string;

  @Column('boolean', { default: false })
  is_read: boolean;

  @ManyToOne(() => UserEntity, (user) => user.send_messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_user_id' })
  to_user: UserEntity;
  @Column()
  to_user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.get_messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'from_user_id' })
  from_user: UserEntity;
  @Column()
  from_user_id: string;
}
