import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { SocketService } from './services/socket.service';

@ApiTags('Socket Chat')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @SkipAuth()
  @ApiOperation({ description: 'Send message to user by id' })
  @Post()
  async sendMessage(
    @CurrentUser() userData: IUserData,
    @Body() message: string,
  ): Promise<string> {
    Logger.log(message);
    this.socketService.server.emit('message', message);
    return 'Message sent';
  }
}
