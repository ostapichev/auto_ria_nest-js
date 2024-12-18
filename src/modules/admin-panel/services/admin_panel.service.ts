import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import {
  BrandCarEntity,
  RefreshTokenEntity,
  UserEntity,
} from '../../../database/entities';
import { AccountTypeEnum, UserRoleEnum } from '../../../database/enums';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AuthCacheService } from '../../auth/services/auth-cache.service';
import { ListQueryDto } from '../../cars/dto/req/list-query.dto';
import { BaseCityResDto } from '../../cars/dto/res/base-city.res.dto';
import { BaseModelResDto } from '../../cars/dto/res/base-model.res.dto';
import { BaseMessageResDto } from '../../chat/dto/res/base-message.res.dto';
import { BrandRepository } from '../../repository/services/brand.repository';
import { CityRepository } from '../../repository/services/city.repository';
import { MessageRepository } from '../../repository/services/message.repository';
import { ModelRepository } from '../../repository/services/model.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { BaseBrandReqDto } from '../dto/req/base-brand.req.dto';
import { BaseCityReqDto } from '../dto/req/base-city.req.dto';
import { BaseModelReqDto } from '../dto/req/base-model.req.dto';

@Injectable()
export class AdminPanelService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userRepository: UserRepository,
    private readonly cityRepository: CityRepository,
    private readonly brandRepository: BrandRepository,
    private readonly modelRepository: ModelRepository,
    private readonly messageRepository: MessageRepository,
    private readonly authCashService: AuthCacheService,
  ) {}

  public async findAllUsers(
    query: ListQueryDto,
  ): Promise<[UserEntity[], number]> {
    return await this.userRepository.getListAllUsers(query);
  }

  public async getFromUserMessages(
    userId: string,
  ): Promise<BaseMessageResDto[]> {
    const user = await this.getUser(userId);
    if (user.role === UserRoleEnum.SUPERUSER) {
      throw new ForbiddenException('No permission to perform this user!');
    }
    return await this.messageRepository.find({
      where: { from_user_id: userId },
    });
  }

  public async getUserMessages(userId: string): Promise<BaseMessageResDto[]> {
    const user = await this.getUser(userId);
    if (user.role === UserRoleEnum.SUPERUSER) {
      throw new ForbiddenException('No permission to perform this user!');
    }
    return await this.messageRepository.find({
      where: { to_user_id: userId },
    });
  }

  public async toAdmin(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (user.role === UserRoleEnum.ADMIN) {
      throw new BadRequestException('The user is admin!');
    }
    if (user.role === UserRoleEnum.BUYER || user.role === UserRoleEnum.SELLER) {
      await this.userRepository.update(userId, {
        role: UserRoleEnum.ADMIN,
        account: AccountTypeEnum.PREMIUM,
      });
    }
  }

  public async toUser(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (user.role === UserRoleEnum.SELLER || user.role === UserRoleEnum.BUYER) {
      throw new BadRequestException('The user is no admin!');
    }
    if (user.role === UserRoleEnum.ADMIN) {
      await this.userRepository.update(userId, {
        role: UserRoleEnum.SELLER,
      });
    }
  }

  public async banUser(userId: string, userData: IUserData): Promise<void> {
    await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const user = await this.getUser(userId);
      const userRepository = em.getRepository(UserEntity);
      const refreshTokenRepository = em.getRepository(RefreshTokenEntity);
      if (user.role === UserRoleEnum.ADMIN || UserRoleEnum.SUPERUSER) {
        if (userData.role === UserRoleEnum.ADMIN) {
          throw new ForbiddenException('You do not have permissions!');
        }
      }
      if (!user.status) {
        throw new BadRequestException('The user is banned!');
      }
      await userRepository.update(userId, {
        status: false,
      });
      await this.authCashService.deleteToken(userId, userData.deviceId);
      await refreshTokenRepository.delete({ user_id: userId });
    });
  }

  public async unbanUser(userId: string, userData: IUserData): Promise<void> {
    const user = await this.getUser(userId);
    if (user.role === UserRoleEnum.ADMIN || UserRoleEnum.SUPERUSER) {
      if (userData.role === UserRoleEnum.ADMIN) {
        throw new BadRequestException('You do not have permissions!');
      }
    }
    if (user.status) {
      throw new BadRequestException('The user is active!');
    }
    await this.userRepository.update(userId, {
      status: true,
    });
  }

  public async addCity(dto: BaseCityReqDto): Promise<BaseCityResDto> {
    const city = await this.cityRepository.findOneBy({ name: dto.name });
    if (city) {
      throw new ConflictException('This city already exists!');
    }
    return await this.cityRepository.save(dto);
  }

  public async addCarBrand(dto: BaseBrandReqDto): Promise<BrandCarEntity> {
    const brand = await this.brandRepository.findOneBy({ name: dto.name });
    if (brand) {
      throw new ConflictException('The brand has already exists!');
    }
    return await this.brandRepository.save(dto);
  }

  public async addCarModel(
    dto: BaseModelReqDto,
    brandId: string,
  ): Promise<BaseModelResDto> {
    const brand = await this.brandRepository.findOneBy({ id: brandId });
    const model = await this.modelRepository.findOneBy({ name: dto.name });
    if (!brand) {
      throw new NotFoundException('The brand does not exist!');
    }
    if (model) {
      throw new ConflictException('The model has already exists!');
    }
    return await this.modelRepository.save(
      this.modelRepository.create({
        brand_id: brandId,
        ...dto,
      }),
    );
  }

  private async getUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }
}
