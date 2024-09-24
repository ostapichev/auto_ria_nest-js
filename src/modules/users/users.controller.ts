import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiFile } from '../../common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { BaseResDto } from '../mail-sender/dto/res/base-res.dto';
import { UpdateBalanceDto } from './dto/req/update-balance.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UserResDto } from './dto/res/user.res.dto';
import { UserResPublicDto } from './dto/res/user.res-public.dto';
import { UserMapper } from './services/user.mapper';
import { UsersService } from './services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @Get('me')
  public async findMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    const result = await this.usersService.findMe(userData);
    return UserMapper.toResponseDTO(result);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResDto> {
    const result = await this.usersService.updateMe(userData, dto);
    return UserMapper.toResponseItemDTO(result);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('me/balance')
  public async addBalance(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateBalanceDto,
  ): Promise<BaseResDto> {
    await this.usersService.addBalanceMe(userData, dto);
    return { message: `Balance ${dto.balance} UAH added!` };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('me/premium_account')
  public async getPremium(
    @CurrentUser() userData: IUserData,
  ): Promise<BaseResDto> {
    await this.usersService.getPremium(userData, 500);
    return { message: 'Premium account took!' };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('me/basic_account')
  public async getBasic(
    @CurrentUser() userData: IUserData,
  ): Promise<BaseResDto> {
    await this.usersService.getBasic(userData);
    return { message: 'Basic account took!' };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNoContentResponse({ description: 'User has been removed' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.usersService.removeMe(userData);
  }

  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiFile('avatar', false, false)
  @Post('me/avatar')
  public async uploadAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.usersService.uploadAvatar(userData, avatar);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.deleteAvatar(userData);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResPublicDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResponsePublicDTO(result);
  }
}
