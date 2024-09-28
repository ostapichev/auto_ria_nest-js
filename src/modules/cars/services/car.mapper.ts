import { ConfigStaticService } from '../../../config';
import { CarEntity } from '../../../database/entities';
import { ListQueryDto } from '../dto/req/list-query.dto';
import { CarResDto } from '../dto/res/car.res.dto';
import { CarListResDto } from '../dto/res/car-list.res.dto';
import { CarListItemResDto } from '../dto/res/car-list-item.res.dto';
import { CarUpdateResDto } from '../dto/res/car-update-res.dto';

export class CarMapper {
  public static toResponseListDTO(
    entities: CarEntity[],
    total: number,
    query: ListQueryDto,
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
      start_price: entity.start_price,
      update_price: entity.update_price,
      currency: entity.currency,
      model: entity.model_id,
      created: entity.created,
      start_currencies_rate: entity.start_currencies_rate.map(
        (currency_rate) => currency_rate.id,
      ),
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
      start_price: Number(entity.start_price),
      update_price: Number(entity.update_price),
      currency: entity.currency,
      year: Number(entity.year),
      active: entity.is_active,
      created: entity.created,
      updated: entity.updated,
      start_currencies_rate: entity.start_currencies_rate.map(
        (currency_rate) => currency_rate.id,
      ),
      user_id: entity.user_id,
    };
  }

  public static toResponseUpdateDTO(entity: CarEntity): CarUpdateResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: entity.id,
      photo: entity.photo ? `${awsConfig.bucketUrl}/${entity.photo}` : null,
      title: entity.title,
      description: entity.description,
      color: entity.color,
      start_price: Number(entity.start_price),
      update_price: Number(entity.update_price),
      currency: entity.currency,
      year: Number(entity.year),
      active: entity.is_active,
      created: entity.created,
      updated: entity.updated,
      user_id: entity.user_id,
    };
  }
}
