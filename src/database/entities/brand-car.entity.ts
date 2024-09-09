import { Column, Entity, OneToMany } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { ModelCarEntity } from './model-car.entity';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.BRANDS)
export class BrandCarEntity extends CreateUpdateModel {
  @Column('text')
  name?: string;

  @OneToMany(() => ModelCarEntity, (entity) => entity.brand)
  models?: ModelCarEntity[];
}
