import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { TableNameEnum } from '../enums';
import { BrandCarEntity } from './brand-car.entity';
import { CarEntity } from './car.entity';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.MODELS)
export class ModelCarEntity extends CreateUpdateModel {
  @Column('text', { unique: true })
  name: string;

  @Column()
  brand_id: string;
  @ManyToOne(() => BrandCarEntity, (entity) => entity.models, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandCarEntity;

  @OneToMany(() => CarEntity, (entity) => entity.model)
  cars?: CarEntity[];
}
