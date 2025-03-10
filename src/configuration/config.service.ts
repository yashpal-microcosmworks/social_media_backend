import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/common/logger/custom-logger.service';
import config from 'src/configuration/properties';

@Injectable()
export class ConfigService {
  static PROPERTIES;

  constructor(private readonly logger: CustomLogger) {
    if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == '') {
      ConfigService.PROPERTIES = config.development;
    }

    if (process.env.NODE_ENV == 'production') {
      ConfigService.PROPERTIES = config.production;
    }
  }
}
