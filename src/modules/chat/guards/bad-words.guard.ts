import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { badWords } from '../../../common/constants/bad-words';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserEntity } from '../../../database/entities/user.entity';
import { AuthCacheService } from '../../auth/services/auth-cache.service';
import { MailSenderService } from '../../mail-sender/services/mail-sender.service';
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
    private readonly mailSenderService: MailSenderService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId, email, deviceId } = request.user;
    const hasBadWord = badWords.some((badWord: string) =>
      request.body.content.toLowerCase().includes(badWord),
    );
    if (hasBadWord) {
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
          let admin: UserEntity;
          await this.userRepository.update(userId, {
            status: false,
          });
          admin = await this.userRepository.findOneBy({
            role: UserRoleEnum.ADMIN,
            status: true,
          });
          if (!admin) {
            admin = await this.userRepository.findOneBy({
              role: UserRoleEnum.SUPERUSER,
            });
          }
          await this.badCountRepository.delete({ user_id: userId });
          await this.authCashService.deleteToken(userId, deviceId);
          await this.refreshTokenRepository.delete({ user_id: userId });
          await this.mailSenderService.sendMail({
            to: admin.email,
            subject: 'The email from chat on auto ria.',
            text: `The user id: ${userId} email: ${email} tried to write bad words 3 times! He is banned!`,
          });
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
    return !hasBadWord;
  }
}
