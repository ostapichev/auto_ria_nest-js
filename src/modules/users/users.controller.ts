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

import { ApiFile } from '../../common/decorators/api-file.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UpdateBalanceDto } from './dto/req/update-balance.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UserResDto } from './dto/res/user.res.dto';
import { UserMapper, UsersService } from './services';

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
    return UserMapper.toResponseDTO(result);
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
  ): Promise<string> {
    await this.usersService.addBalanceMe(userData, dto);
    return `Balance ${dto.balance} UAH added!`;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('me/premium_account')
  public async getPremium(@CurrentUser() userData: IUserData): Promise<string> {
    await this.usersService.getPremium(userData, 500);
    return `Premium account took!`;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('me/basic_account')
  public async getBasic(@CurrentUser() userData: IUserData): Promise<string> {
    await this.usersService.getBasic(userData);
    return `Basic account took!`;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
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

  @SkipAuth()
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResponseDTO(result);
  }
}
