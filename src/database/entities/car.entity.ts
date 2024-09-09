import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.CARS)
export class CarEntity extends CreateUpdateModel {
  @Column('text', { nullable: true })
  photo?: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  brand: string;

  @Column('text')
  model: string;

  @Column('text')
  color: string;

  @Column('int')
  price: number;

  @Column('int')
  year: number;

  @Column('int', { nullable: true })
  count_view?: number;

  @Column('boolean', { nullable: true })
  active?: boolean;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
