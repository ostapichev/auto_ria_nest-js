import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { RepositoryModule } from '../repository/repository.module';
import { AdminPanelController } from './admin_panel.controller';
import { AdminPanelService } from './services/admin_panel.service';

@Module({
  imports: [RepositoryModule, ChatModule, AuthModule],
  controllers: [AdminPanelController],
  providers: [AdminPanelService],
})
export class AdminPanelModule {}
