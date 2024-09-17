import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CurrencyEnum } from '../../modules/currency-rate/enums/currency.enum';
import { BrandCarEntity } from './brand-car.entity';
import { CarViewsEntity } from './car-views.entity';
import { CityEntity } from './city.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { ModelCarEntity } from './model-car.entity';
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
  color: string;

  @Column('int')
  start_price: number;

  @Column('int', { default: 0 })
  update_price?: number;

  @Column('text', { default: CurrencyEnum.UAH })
  currency: CurrencyEnum;

  @Column('int')
  year: number;

  @Column('boolean', { default: true })
  active: boolean;

  @Column('string', { nullable: true })
  brand_id: string;
  @ManyToOne(() => BrandCarEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'brand_id' })
  brand?: BrandCarEntity;

  @Column('string', { nullable: true })
  model_id: string;
  @ManyToOne(() => ModelCarEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'model_id' })
  model?: ModelCarEntity;

  @Column('string', { nullable: true })
  city_id: string;
  @ManyToOne(() => CityEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'city_id' })
  city?: CityEntity;

  @Column('string')
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => CarViewsEntity, (carViews) => carViews.car, {
    onDelete: 'CASCADE',
  })
  views?: CarViewsEntity;
}
