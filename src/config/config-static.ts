import * as process from 'node:process';

import * as dotenv from 'dotenv';

import { Config } from './config.type';
import configuration from './configuration';

class ConfigStatic {
  public get(): Config {
    return configuration();
  }
}

const env = process.env.ENVIROMENT || 'local';
dotenv.config({ path: `environments/${env}.env` });
const ConfigStaticService = new ConfigStatic();
export { ConfigStaticService };
