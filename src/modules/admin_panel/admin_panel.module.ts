import { Module } from '@nestjs/common';

import { RepositoryModule } from '../repository/repository.module';
import { AdminPanelController } from './admin_panel.controller';
import { AdminPanelService } from './services/admin_panel.service';

@Module({
  imports: [RepositoryModule],
  controllers: [AdminPanelController],
  providers: [AdminPanelService],
})
export class AdminPanelModule {}
