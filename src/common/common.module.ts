import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { LoggerModule } from './logger/logger.module';
import { SesService } from 'src/third-party/aws/SES/ses.service';

@Module({
  imports: [LoggerModule],
  providers: [EmailService, SesService],
  exports: [EmailService],
})
export class CommonModule {}
