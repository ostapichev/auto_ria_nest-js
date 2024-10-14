import { ConfigStaticService } from '../../../config';
import { UserEntity } from '../../../database/entities';
import { UserListResDto } from '../../admin-panel/dto/res/user-list.res.dto';
import { IJwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { ListQueryDto } from '../../cars/dto/req/list-query.dto';
import { UserResItemDto } from '../dto/res/user.item.res.dto';
import { UserResDto } from '../dto/res/user.res.dto';
import { UserResPublicDto } from '../dto/res/user.res-public.dto';

export class UserMapper {
  public static toResponseListDTO(
    entities: UserEntity[],
    total: number,
    query: ListQueryDto,
  ): UserListResDto {
    return {
      data: entities.map(this.toResponseDTO),
      total,
      ...query,
    };
  }

  public static toResponseDTO(data: UserEntity): UserResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: data.id,
      image: data.image ? `${awsConfig.bucketUrl}/${data.image}` : null,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      gender: data.gender,
      account: data.account,
      balance: Number(data.balance),
      status: true,
      cars: data.cars.map((car) => car.id),
      createdAt: data.created,
      updatedAt: data.updated,
    };
  }

  public static toResponseItemDTO(data: UserEntity): UserResItemDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: data.id,
      image: data.image ? `${awsConfig.bucketUrl}/${data.image}` : null,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      gender: data.gender,
      account: data.account,
      balance: Number(data.balance),
      status: data.status,
      createdAt: data.created,
      updatedAt: data.updated,
    };
  }

  public static toResponsePublicDTO(data: UserEntity): UserResPublicDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: data.id,
      image: data.image ? `${awsConfig.bucketUrl}/${data.image}` : null,
      name: data.name,
      phone: data.phone,
      gender: data.gender,
      email: data.email,
      createdAt: data.created,
      cars: data.cars.map((car) => car.id),
    };
  }

  public static toIUserData(user: UserEntity, payload: IJwtPayload): IUserData {
    return {
      userId: payload.userId,
      deviceId: payload.deviceId,
      email: user.email,
      role: user.role,
      gender: user.gender,
      account: user.account,
      status: user.status,
      cars: user.cars,
    };
  }
}
