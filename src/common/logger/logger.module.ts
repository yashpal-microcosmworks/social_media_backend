import { Module } from '@nestjs/common';
import { CustomLogger } from 'src/common/logger/custom-logger.service';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
