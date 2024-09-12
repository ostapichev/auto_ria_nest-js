import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CarEntity } from './car.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.CAR_VIEWS)
export class CarViewsEntity extends CreateUpdateModel {
  @Column({ default: 0 })
  viewsCount: number;

  @OneToOne(() => CarEntity, (car) => car.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: CarEntity;
  @Column()
  car_id: string;
}
