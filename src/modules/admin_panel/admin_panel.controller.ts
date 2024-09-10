import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserEntity } from '../../database/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { AdminGuard } from './guards/admin.guard';
import { IdMeGuard } from './guards/id-me.guard';
import { SuperUserGuard } from './guards/superuser.guard';
import { AdminPanelService } from './services/admin_panel.service';

@ApiBearerAuth()
@ApiTags('Admin Panel')
@Controller('admin-panel')
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  public async findAllUsers(): Promise<UserEntity[]> {
    return await this.adminPanelService.findAllUsers();
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard, IdMeGuard)
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserEntity> {
    return await this.adminPanelService.findOne(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SuperUserGuard, IdMeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('to_admin/:userId')
  public async toAdmin(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.adminPanelService.toAdmin(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SuperUserGuard, IdMeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('to_user/:userId')
  public async toUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.adminPanelService.toUser(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard, IdMeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('ban/:userId')
  public async banUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.adminPanelService.banUser(userId, userData);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard, IdMeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('unban/:userId')
  public async unbanUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.adminPanelService.unbanUser(userId, userData);
  }
}