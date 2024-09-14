import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { MailSenderModule } from '../mail-sender/mail-sender.module';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';

@Module({
  imports: [AuthModule, MailSenderModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
