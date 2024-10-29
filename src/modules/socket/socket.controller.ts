import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { BaseMessageChatReqDto } from './dto/req/base-chat-message.req.dto';
import { SocketService } from './services/socket.service';

@ApiTags('Socket Chat')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @SkipAuth()
  @ApiOperation({ description: 'Send message to user by id' })
  @Post()
  public sendMessage(@Body() message: BaseMessageChatReqDto): string {
    Logger.log(message.message);
    this.socketService.server.emit('message', message);
    return `Message: "${message.message}" sent!`;
  }
}
