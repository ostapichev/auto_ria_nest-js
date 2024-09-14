import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MailSenderService } from './services/mail-sender.service';

@Controller('mail')
export class MailSenderController {
  constructor(private readonly mailService: MailSenderService) {}

  @ApiTags('Mail Sender')
  @Post('send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ) {
    await this.mailService.sendMail(to, subject, text);
    return { message: 'Email sent successfully' };
  }
}
