import { ConfigStaticService } from '../../../config/config-static';
import { UserEntity } from '../../../database/entities/user.entity';
import { IJwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserResDto } from '../dto/res/user.res.dto';

export class UserMapper {
  public static toResponseDTO(data: UserEntity): UserResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: data.id,
      image: data.image ? `${awsConfig.bucketUrl}/${data.image}` : null,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      account: data.account,
      balance: Number(data.balance),
      createdAt: data.created,
      updatedAt: data.updated,
    };
  }

  public static toIUserData(user: UserEntity, payload: IJwtPayload): IUserData {
    return {
      userId: payload.userId,
      deviceId: payload.deviceId,
      email: user.email,
    };
  }
}
