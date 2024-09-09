import { ConfigStaticService } from '../../../config/config-static';
import { CarEntity } from '../../../database/entities/car.entity';
import { CarListQueryDto } from '../dto/req/car-list.query.dto';
import { CarResDto } from '../dto/res/car.res.dto';
import { CarListResDto } from '../dto/res/car-list.res.dto';
import { CarListItemResDto } from '../dto/res/car-list-item.res.dto';

export class CarMapper {
  public static toResponseListDTO(
    entities: CarEntity[],
    total: number,
    query: CarListQueryDto,
  ): CarListResDto {
    return {
      data: entities.map(this.toResponseListItemDTO),
      total,
      ...query,
    };
  }

  public static toResponseListItemDTO(entity: CarEntity): CarListItemResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: entity.id,
      photo: entity.photo ? `${awsConfig.bucketUrl}/${entity.photo}` : null,
      title: entity.title,
      description: entity.description,
      created: entity.created,
      user_id: entity.user_id,
    };
  }

  public static toResponseDTO(entity: CarEntity): CarResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: entity.id,
      photo: entity.photo ? `${awsConfig.bucketUrl}/${entity.photo}` : null,
      title: entity.title,
      description: entity.description,
      brand: entity.brand,
      model: entity.model,
      color: entity.color,
      year: entity.year,
      count_view: entity.count_view,
      active: entity.active,
      created: entity.created,
      updated: entity.updated,
      user_id: entity.user_id,
    };
  }
}
