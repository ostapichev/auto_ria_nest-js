export type Config = {
  superuser: SuperUserConfig;
  app: AppConfig;
  postgres: PostgresConfig;
  redis: RedisConfig;
  sentry: SentryConfig;
  email: EmailConfig;
  jwt: JwtConfig;
  aws: AwsConfig;
  apiPrivate: PrivateBankConfig;
  timeZone: TimeZoneConfig;
};

export type SuperUserConfig = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type PostgresConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  port: number;
  host: string;
  password: string;
};

export type SentryConfig = {
  dsn: string;
  env: string;
  debug: boolean;
};

export type EmailConfig = {
  service: string;
  email: string;
  password: string;
};

export type JwtConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};

export type AwsConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  bucketUrl: string;
  endpoint: string;
};

export type PrivateBankConfig = {
  url: string;
};

export type TimeZoneConfig = {
  timeZone: string;
};
