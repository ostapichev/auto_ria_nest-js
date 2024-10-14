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
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BrandCarEntity, UserEntity } from '../../database/entities';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { ListQueryDto } from '../cars/dto/req/list-query.dto';
import { BaseCityResDto } from '../cars/dto/res/base-city.res.dto';
import { BaseModelResDto } from '../cars/dto/res/base-model.res.dto';
import { BaseMessageResDto } from '../chat/dto/res/base-message.res.dto';
import { UserMapper } from '../users/services/user.mapper';
import { BaseBrandReqDto } from './dto/req/base-brand.req.dto';
import { BaseCityReqDto } from './dto/req/base-city.req.dto';
import { BaseModelReqDto } from './dto/req/base-model.req.dto';
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

  @ApiOperation({ description: 'Get list all users' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  public async findAllUsers(
    @Query() query: ListQueryDto,
  ): Promise<UserListResDto> {
    const [entities, total] = await this.adminPanelService.findAllUsers(query);
    return UserMapper.toResponseListDTO(entities, total, query);
  }

  @ApiOperation({ description: 'Get user by id for administrators' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard, IdMeGuard)
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserEntity> {
    return await this.adminPanelService.findOne(userId);
  }

  @ApiOperation({ description: 'Get sent messages chat from user by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get('chat_from/:userId')
  public async getFromUserMessages(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<BaseMessageResDto[]> {
    return await this.adminPanelService.getFromUserMessages(userId);
  }

  @ApiOperation({ description: 'Get messages from chat to user by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get('chat_to/:userId')
  public async getUserMessages(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<BaseMessageResDto[]> {
    return await this.adminPanelService.getUserMessages(userId);
  }

  @ApiOperation({ description: 'User to admin' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SuperUserGuard, IdMeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('to-admin/:userId')
  public async toAdmin(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.adminPanelService.toAdmin(userId);
  }

  @ApiOperation({ description: 'Admin to user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SuperUserGuard, IdMeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('to-user/:userId')
  public async toUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.adminPanelService.toUser(userId);
  }

  @ApiOperation({ description: 'Ban user by id' })
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

  @ApiOperation({ description: 'Unban user by id' })
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

  @ApiOperation({ description: 'Add city on the db' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Post('add-city')
  public async addCity(@Body() dto: BaseCityReqDto): Promise<BaseCityResDto> {
    return await this.adminPanelService.addCity(dto);
  }

  @ApiOperation({ description: 'Add brand on the db' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Post('add-brand')
  public async addCarBrand(
    @Body() dto: BaseBrandReqDto,
  ): Promise<BrandCarEntity> {
    return await this.adminPanelService.addCarBrand(dto);
  }

  @ApiOperation({ description: 'Add model in the brand on the db' })
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
