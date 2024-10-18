import { MessageEntity } from '../../../database/entities';
import { BaseMessageResDto } from '../../chat/dto/res/base-message.res.dto';

export class MessageMapper {
  public static toResponseListDTO(
    entities: BaseMessageResDto[],
  ): BaseMessageResDto[] {
    return entities.map(this.toResponseListItemDTO);
  }

  public static toResponseListItemDTO(
    entity: MessageEntity,
  ): BaseMessageResDto {
    return {
      id: entity.id,
      content: entity.content,
      from_user_id: entity.from_user_id,
      to_user_id: entity.to_user_id,
      is_read: entity.is_read,
    };
  }
}
