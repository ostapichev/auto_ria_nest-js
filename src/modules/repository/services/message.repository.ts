import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { MessageEntity } from '../../../database/entities';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(MessageEntity, dataSource.manager);
  }
}
