import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BrandCarEntity } from './brand-car.entity';
import { CarEntity } from './car.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.MODELS)
export class ModelCarEntity extends CreateUpdateModel {
  @Column('text', { unique: true })
  name?: string;

  @Column()
  brand_id: string;
  @ManyToOne(() => BrandCarEntity, (entity) => entity.models)
  @JoinColumn({ name: 'brand_id' })
  brand?: BrandCarEntity;

  @OneToMany(() => CarEntity, (entity) => entity.model, { onDelete: 'CASCADE' })
  cars?: CarEntity[];
}
