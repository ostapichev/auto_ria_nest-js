import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from '../enums';
import { CarEntity } from './car.entity';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.CAR_VIEWS)
export class CarViewsEntity extends CreateUpdateModel {
  @Column('int', { default: 0 })
  viewsCount: number;

  @ManyToOne(() => CarEntity, (car) => car.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: CarEntity;
  @Column()
  car_id: string;
}
