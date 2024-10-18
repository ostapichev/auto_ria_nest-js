import { CityEntity } from '../../../database/entities';
import { BaseCityResDto } from '../dto/res/base-city.res.dto';

export class CityMapper {
  public static toResponseListDTO(entities: CityEntity[]): BaseCityResDto[] {
    return entities.map(this.toResponseListItemDTO);
  }

  public static toResponseListItemDTO(entity: CityEntity): BaseCityResDto {
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
