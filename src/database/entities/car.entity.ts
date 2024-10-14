import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ColorCarEnum, CurrencyEnum, TableNameEnum } from '../enums';
import { BrandCarEntity } from './brand-car.entity';
import { CarViewsEntity } from './car-views.entity';
import { CityEntity } from './city.entity';
import { CurrencyRateEntity } from './currency-rate.entity';
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
  color: ColorCarEnum;

  @Column('int')
  start_price: number;

  @Column('int', { default: 0 })
  update_price: number;

  @Column('text', { default: CurrencyEnum.UAH })
  currency: CurrencyEnum;

  @Column('int')
  year: number;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('string', { nullable: true })
  brand_id: string;
  @ManyToOne(() => BrandCarEntity, (entity) => entity.cars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandCarEntity;

  @Column('string', { nullable: true })
  model_id: string;
  @ManyToOne(() => ModelCarEntity, (entity) => entity.cars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'model_id' })
  model: ModelCarEntity;

  @Column('string', { nullable: true })
  city_id: string;
  @ManyToOne(() => CityEntity, (entity) => entity.cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_id' })
  city: CityEntity;

  @Column('string')
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => CarViewsEntity, (carViews) => carViews.car)
  views?: CarViewsEntity;

  @ManyToMany(() => CurrencyRateEntity, (entity) => entity.cars)
  @JoinTable()
  start_currencies_rate?: CurrencyRateEntity[];
}
