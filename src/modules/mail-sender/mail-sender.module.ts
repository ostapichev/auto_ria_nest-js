import { Module } from '@nestjs/common';

import { MailSenderController } from './mail-sender.controller';
import { MailSenderService } from './services/mail-sender.service';

@Module({
  controllers: [MailSenderController],
  providers: [MailSenderService],
  exports: [MailSenderService],
})
export class MailSenderModule {}
