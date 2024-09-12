import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { BaseMessageReqDto } from './dto/req/base-message.req.dto';
import { BaseMessageResDto } from './dto/res/base-message.res.dto';
import { AuthorChatGuard } from './guards/author_chat.guard';
import { ChatService } from './services/chat.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Post(':to_user_id')
  public async sendMessage(
    @CurrentUser() userData: IUserData,
    @Param('to_user_id', ParseUUIDPipe) to_user_id: string,
    @Body() dto: BaseMessageReqDto,
  ): Promise<BaseMessageResDto> {
    return await this.chatService.sendMessage(userData, to_user_id, dto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get(':to_user_id/sent_messages')
  public async findSentMessagesToUser(
    @CurrentUser() userData: IUserData,
    @Param('to_user_id', ParseUUIDPipe) to_user_id: string,
  ): Promise<BaseMessageResDto[]> {
    return await this.chatService.findSentMessagesToUser(userData, to_user_id);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthorChatGuard)
  @Get(':from_user_id/get_messages')
  public async findSentMessageFromUser(
    @CurrentUser() userData: IUserData,
    @Param('from_user_id', ParseUUIDPipe) from_user_id: string,
  ): Promise<BaseMessageResDto[]> {
    return await this.chatService.findGetMessagesToUser(userData, from_user_id);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthorChatGuard)
  @Patch(':messageId/edit_message')
  public async editMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body() dto: BaseMessageReqDto,
  ): Promise<BaseMessageResDto> {
    return await this.chatService.editMessage(messageId, dto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthorChatGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':messageId/delete_message')
  public async deleteMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ): Promise<string> {
    return await this.chatService.deleteMessage(messageId);
  }
}
