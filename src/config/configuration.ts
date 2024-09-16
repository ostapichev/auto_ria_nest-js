import * as process from 'node:process';

import { Config } from './config.type';

export default (): Config => ({
  superuser: {
    name: process.env.SUPER_USER_NAME,
    phone: process.env.SUPER_USER_PHONE,
    email: process.env.SUPER_USER_EMAIL,
    password: process.env.SUPER_USER_PASSWORD,
  },
  app: {
    port: Number(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || 'localhost',
  },
  postgres: {
    port: Number(process.env.POSTGRES_PORT),
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    env: process.env.SENTRY_ENV,
    debug: process.env.SENTRY_DEBUG === 'true',
  },
  email: {
    service: process.env.SMTP_SERVICE,
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
  },
  aws: {
    region: process.env.AWS_S3_REGION,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    bucketUrl: process.env.AWS_S3_BUCKET_URL,
    endpoint: process.env.AWS_S3_ENDPOINT,
  },
  apiPrivate: {
    url: process.env.API_PRIVAT_BANK_UA,
  },
  timeZone: {
    timeZone: process.env.LOCAL_TIME_ZONE,
  }
});
