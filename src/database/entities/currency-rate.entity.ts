import { Column, Entity, ManyToMany } from 'typeorm';

import { CurrencyEnum, TableNameEnum } from '../enums';
import { CarEntity } from './car.entity';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.CURRENCIES_RATE)
export class CurrencyRateEntity extends CreateUpdateModel {
  @Column('text')
  ccy: CurrencyEnum;

  @Column('text')
  base_ccy: CurrencyEnum;

  @Column('text')
  buy: string;

  @Column('text')
  sale: string;

  @ManyToMany(() => CarEntity, (entity) => entity.start_currencies_rate)
  cars?: CarEntity[];
}
