import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';

import { Config, EmailConfig } from '../../../config';
import { BaseMailReqDto } from '../dto/req/base-mail-sender.req.dto';

@Injectable()
export class MailSenderService {
  private transporter: Transporter;

  constructor(private configService: ConfigService<Config>) {
    const config = this.configService.get<EmailConfig>('email');
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
  }

  public async sendMail(dto: BaseMailReqDto): Promise<string> {
    const config = this.configService.get<EmailConfig>('email');
    const { to, subject, text } = dto;
    const mailOptions = {
      from: config.email,
      to,
      subject,
      text,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
