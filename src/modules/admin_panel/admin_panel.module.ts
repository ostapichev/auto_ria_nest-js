import { Module } from '@nestjs/common';

import { ChatModule } from '../chat/chat.module';
import { RepositoryModule } from '../repository/repository.module';
import { AdminPanelController } from './admin_panel.controller';
import { AdminPanelService } from './services/admin_panel.service';

@Module({
  imports: [RepositoryModule, ChatModule],
  controllers: [AdminPanelController],
  providers: [AdminPanelService],
})
export class AdminPanelModule {}
