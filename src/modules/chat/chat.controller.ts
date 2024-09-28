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
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { AuthorGuard } from '../cars/guards/author.guard';
import { BadWordsGuard } from '../cars/guards/bad-words.guard';
import { BaseResDto } from '../mail-sender/dto/res/base-res.dto';
import { BaseMessageReqDto } from './dto/req/base-message.req.dto';
import { BaseMessageResDto } from './dto/res/base-message.res.dto';
import { ChatService } from './services/chat.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ description: 'Send message to user by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(BadWordsGuard)
  @Post(':to_user_id')
  public async sendMessage(
    @CurrentUser() userData: IUserData,
    @Param('to_user_id', ParseUUIDPipe) to_user_id: string,
    @Body() dto: BaseMessageReqDto,
  ): Promise<BaseMessageResDto> {
    return await this.chatService.sendMessage(userData, to_user_id, dto);
  }

  @ApiOperation({ description: 'Get message' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get(':messageId')
  public async getMessageById(
    @CurrentUser() userData: IUserData,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ): Promise<BaseMessageResDto> {
    return await this.chatService.getMessageById(messageId, userData.userId);
  }

  @ApiOperation({ description: 'Get sent messages to user by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get(':to_user_id/sent_messages')
  public async findSentMessagesToUser(
    @CurrentUser() userData: IUserData,
    @Param('to_user_id', ParseUUIDPipe) to_user_id: string,
  ): Promise<BaseMessageResDto[]> {
    return await this.chatService.findSentMessagesToUser(userData, to_user_id);
  }

  @ApiOperation({ description: 'Get message from user by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get(':from_user_id/get_messages')
  public async findSentMessageFromUser(
    @CurrentUser() userData: IUserData,
    @Param('from_user_id', ParseUUIDPipe) from_user_id: string,
  ): Promise<BaseMessageResDto[]> {
    return await this.chatService.findGetMessagesToUser(userData, from_user_id);
  }

  @ApiOperation({ description: 'Edit message by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthorGuard)
  @Patch(':messageId/edit_message')
  public async editMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body() dto: BaseMessageReqDto,
  ): Promise<BaseMessageResDto> {
    return await this.chatService.editMessage(messageId, dto);
  }

  @ApiOperation({ description: 'Delete message by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':messageId/delete_message')
  public async deleteMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ): Promise<BaseResDto> {
    return await this.chatService.deleteMessage(messageId);
  }
}
