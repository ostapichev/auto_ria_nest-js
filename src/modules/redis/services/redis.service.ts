import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from '../constants/redis.constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  public async addOneToSet(hash: string, value: string): Promise<number> {
    return await this.redisClient.sadd(hash, value);
  }

  public async remOneFromSet(key: string, setMember: string): Promise<number> {
    return await this.redisClient.srem(key, setMember);
  }

  public async deleteByKey(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  public async sMembers(key: string): Promise<string[]> {
    return await this.redisClient.smembers(key);
  }

  public async expire(key: string, time: number): Promise<number> {
    return await this.redisClient.expire(key, time);
  }
}
