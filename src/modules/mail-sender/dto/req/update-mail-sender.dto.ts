import { PartialType } from '@nestjs/swagger';
import { CreateMailSenderDto } from './create-mail-sender.dto';

export class UpdateMailSenderDto extends PartialType(CreateMailSenderDto) {}
