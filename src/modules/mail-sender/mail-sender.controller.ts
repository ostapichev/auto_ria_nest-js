import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BaseMailReqDto } from './dto/req/base-mail-sender.req.dto';
import { BaseMailSenderResDto } from './dto/res/base-mail-sender.res.dto';
import { MailSenderService } from './services/mail-sender.service';

@Controller('mail')
export class MailSenderController {
  constructor(private readonly mailService: MailSenderService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @ApiTags('Mail Sender')
  @Post('send')
  public async sendMail(
    @Body() dto: BaseMailReqDto,
  ): Promise<BaseMailSenderResDto> {
    await this.mailService.sendMail(dto);
    return { message: 'Email sent successfully' };
  }
}
