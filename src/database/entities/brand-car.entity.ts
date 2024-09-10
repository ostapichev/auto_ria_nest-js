import { Column, Entity, OneToMany } from 'typeorm';

import { CarEntity } from './car.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { ModelCarEntity } from './model-car.entity';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.BRANDS)
export class BrandCarEntity extends CreateUpdateModel {
  @Column('text')
  name?: string;

  @OneToMany(() => ModelCarEntity, (entity) => entity.brand)
  models?: ModelCarEntity[];

  @OneToMany(() => CarEntity, (entity) => entity.brand)
  cars?: CarEntity[];
}
