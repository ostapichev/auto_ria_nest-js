import { Column, Entity, OneToMany } from 'typeorm';

import { TableNameEnum } from '../enums';
import { CarEntity } from './car.entity';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.CITIES)
export class CityEntity extends CreateUpdateModel {
  @Column('text', { unique: true })
  name: string;

  @OneToMany(() => CarEntity, (entity) => entity.city)
  cars?: CarEntity[];
}
