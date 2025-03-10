import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { RuntimeExceptionFilter } from './runtimeException.filter';

@Module({
  imports: [LoggerModule],
  providers: [RuntimeExceptionFilter],
  exports: [RuntimeExceptionFilter],
})
export class FilterModule {}
