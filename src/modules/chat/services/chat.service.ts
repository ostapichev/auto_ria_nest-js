import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { MessageRepository } from '../../repository/services/message.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { BaseMessageReqDto } from '../dto/req/base-message.req.dto';
import { BaseMessageResDto } from '../dto/res/base-message.res.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private userRepository: UserRepository,
  ) {}

  public async sendMessage(
    userData: IUserData,
    to_user_id: string,
    dto: BaseMessageReqDto,
  ): Promise<BaseMessageResDto> {
    const user = await this.findUserCorrect(userData, to_user_id);
    return await this.messageRepository.save(
      this.messageRepository.create({
        ...dto,
        to_user_id: user.id,
        from_user_id: userData.userId,
      }),
    );
  }

  public async findSentMessagesToUser(
    userData: IUserData,
    to_user_id: string,
  ): Promise<BaseMessageResDto[]> {
    const user = await this.findUserCorrect(userData, to_user_id);
    const messages = await this.messageRepository.find({
      where: {
        from_user_id: userData.userId,
        to_user_id: user.id,
      },
    });
    if (!messages.length) {
      throw new NotFoundException('No messages sent!');
    }
    return messages;
  }

  public async findGetMessagesToUser(
    userData: IUserData,
    from_user_id: string,
  ): Promise<BaseMessageResDto[]> {
    const user = await this.findUserCorrect(userData, from_user_id);
    const messages = await this.messageRepository.find({
      where: {
        from_user_id: user.id,
        to_user_id: userData.userId,
      },
    });
    if (!messages.length) {
      throw new NotFoundException('No messages sent!');
    }
    return messages;
  }

  public async editMessage(
    messageId: string,
    dto: BaseMessageReqDto,
  ): Promise<BaseMessageResDto> {
    const message = await this.messageRepository.findOneBy({ id: messageId });
    if (!message) {
      throw new NotFoundException('The message does not exist!');
    }
    this.messageRepository.merge(message, dto);
    return await this.messageRepository.save(message);
  }

  public async deleteMessage(messageId: string): Promise<string> {
    await this.messageRepository.delete(messageId);
    return 'Message deleted successfully!';
  }

  private async findUserCorrect(
    userData: IUserData,
    id: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('The user by id does not exist!');
    }
    if (user.id === userData.userId) {
      throw new BadRequestException('The user id not corrected!');
    }
    return user;
  }
}
