import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserEntity } from '../../database/entities';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { ListQueryDto } from '../cars/dto/req/list-query.dto';
import { BaseMessageResDto } from '../chat/dto/res/base-message.res.dto';
import { UserMapper } from '../users/services/user.mapper';
import { BaseBrandReqDto } from './dto/req/base-brand.req.dto';
import { BaseCityReqDto } from './dto/req/base-city.req.dto';
import { BaseModelReqDto } from './dto/req/base-model.req.dto';
import { BaseBrandResDto } from './dto/res/base-brand.res.dto';
import { BaseCityResDto } from './dto/res/base-city.res.dto';
import { BaseModelResDto } from './dto/res/base-model.res.dto';
import { UserListResDto } from './dto/res/user-list.res.dto';
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
  public async findAllUsers(
    @Query() query: ListQueryDto,
  ): Promise<UserListResDto> {
    const [entities, total] = await this.adminPanelService.findAllUsers(query);
    return UserMapper.toResponseListDTO(entities, total, query);
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
  @UseGuards(AdminGuard)
  @Get('chat_from/:userId')
  public async getFromUserMessages(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<BaseMessageResDto[]> {
    return await this.adminPanelService.getFromUserMessages(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get('chat_to/:userId')
  public async getUserMessages(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<BaseMessageResDto[]> {
    return await this.adminPanelService.getUserMessages(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SuperUserGuard, IdMeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('to-admin/:userId')
  public async toAdmin(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.adminPanelService.toAdmin(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SuperUserGuard, IdMeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('to-user/:userId')
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

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Post('add-city')
  public async addCity(@Body() dto: BaseCityReqDto): Promise<BaseCityResDto> {
    return await this.adminPanelService.addCity(dto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Post('add-brand')
  public async addCarBrand(
    @Body() dto: BaseBrandReqDto,
  ): Promise<BaseBrandResDto> {
    return await this.adminPanelService.addCarBrand(dto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Post(':brandId/add-model')
  public async addCarModel(
    @Body() dto: BaseModelReqDto,
    @Param('brandId', ParseUUIDPipe) brandId: string,
  ): Promise<BaseModelResDto> {
    return await this.adminPanelService.addCarModel(dto, brandId);
  }
}
