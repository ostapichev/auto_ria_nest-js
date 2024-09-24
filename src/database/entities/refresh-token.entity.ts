import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from './enums';
import { CreateUpdateModel } from './models';
import { UserEntity } from './user.entity';

@Index(['refreshToken', 'deviceId'])
@Entity(TableNameEnum.REFRESH_TOKENS)
export class RefreshTokenEntity extends CreateUpdateModel {
  @Column('text')
  refreshToken: string;

  @Column('text')
  deviceId: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
