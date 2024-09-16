import { Column, Entity } from 'typeorm';

import { CurrencyEnum } from '../../modules/currency-rate/enums/currency.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models';

@Entity(TableNameEnum.CURRENCIES_RATE)
export class CurrencyRateEntity extends CreateUpdateModel {
  @Column('text')
  ccy: CurrencyEnum;

  @Column('text')
  base_ccy: CurrencyEnum;

  @Column('text')
  buy: number;

  @Column('text')
  sale: number;
}
