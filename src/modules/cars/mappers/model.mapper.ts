import { ModelCarEntity } from '../../../database/entities';
import { BaseModelResDto } from '../dto/res/base-model.res.dto';

export class ModelMapper {
  public static toResponseListDTO(
    entities: ModelCarEntity[],
  ): BaseModelResDto[] {
    return entities.map(this.toResponseListItemDTO);
  }

  public static toResponseListItemDTO(entity: ModelCarEntity): BaseModelResDto {
    return {
      id: entity.id,
      name: entity.name,
      brand_id: entity.brand_id,
    };
  }
}
