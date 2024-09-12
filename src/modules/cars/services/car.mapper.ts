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
      city: entity.city_id,
      brand: entity.brand_id,
      price: entity.price,
      currency: entity.currency,
      model: entity.model_id,
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
      color: entity.color,
      price: Number(entity.price),
      currency: entity.currency,
      year: Number(entity.year),
      active: entity.active,
      created: entity.created,
      updated: entity.updated,
      user_id: entity.user_id,
    };
  }
}
