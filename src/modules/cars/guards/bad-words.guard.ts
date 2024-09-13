import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthCacheService } from '../../auth/services/auth-cache.service';
import { BadCountRepository } from '../../repository/services/bad-count.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';

@Injectable()
export class BadWordsGuard implements CanActivate {
  constructor(
    @InjectRepository(BadCountRepository)
    private readonly badCountRepository: BadCountRepository,
    private readonly userRepository: UserRepository,
    private readonly authCashService: AuthCacheService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId, deviceId } = request.user;
    const badWords = ['fuck', 'sheet'];
    const hasBadWordTitle = badWords.some((badWord: string) =>
      request.body.title.toLowerCase().includes(badWord),
    );
    const hasBadWordDescription = badWords.some((badWord: string) =>
      request.body.title.toLowerCase().includes(badWord),
    );
    if (hasBadWordTitle || hasBadWordDescription) {
      const badCount = await this.badCountRepository.findOneBy({
        user_id: userId,
      });
      if (badCount) {
        await this.badCountRepository.increment(
          { user_id: userId },
          'count',
          1,
        );
        if (badCount.count > 0) {
          await this.userRepository.update(userId, {
            status: false,
          });
          await this.badCountRepository.delete({ user_id: userId });
          await this.authCashService.deleteToken(userId, deviceId);
          await this.refreshTokenRepository.delete({ user_id: userId });
        }
        throw new BadRequestException('The text has some bad words!');
      } else {
        await this.badCountRepository.save(
          this.badCountRepository.create({
            user_id: userId,
          }),
        );
        throw new BadRequestException('The text has some bad words!');
      }
    }
    return !hasBadWordTitle || !hasBadWordDescription;
  }
}
