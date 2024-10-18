import { BaseCurrencyRateResDto } from '../dto/res/base-currency-rate.dto';

export class CurrencyMapper {
  public static toResponseListDTO(
    entities: CurrencyMapper[],
  ): BaseCurrencyRateResDto[] {
    return entities.map(this.toResponseListItemDTO);
  }

  public static toResponseListItemDTO(
    entity: BaseCurrencyRateResDto,
  ): BaseCurrencyRateResDto {
    return {
      id: entity.id,
      base_ccy: entity.base_ccy,
      ccy: entity.ccy,
      buy: entity.buy,
      sale: entity.sale,
    };
  }
}
