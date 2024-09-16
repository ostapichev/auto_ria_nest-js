import { CurrencyEnum } from '../enums/currency.enum';

export interface ICurrency {
  ccy: CurrencyEnum;
  base_ccy: CurrencyEnum.UAH;
  buy: number;
  sale: number;
}
