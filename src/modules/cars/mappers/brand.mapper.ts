import { BrandCarEntity } from '../../../database/entities';
import { BaseBrandResDto } from '../dto/res/base-brand.res.dto';

export class BrandMapper {
  public static toResponseListDTO(
    entities: BrandCarEntity[],
  ): BaseBrandResDto[] {
    return entities.map(this.toResponseListItemDTO);
  }

  public static toResponseListItemDTO(entity: BrandCarEntity): BaseBrandResDto {
    return {
      id: entity.id,
      name: entity.name,
      models: entity.models.map((model) => model),
    };
  }
}
