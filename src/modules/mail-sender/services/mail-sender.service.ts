import { Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailSenderService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'oktenittest@gmail.com',
        pass: 'prelecdntknhqqby',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'oktenittest@gmail.com',
      to,
      subject,
      text,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
