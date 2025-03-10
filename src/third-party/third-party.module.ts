import { Module } from '@nestjs/common';
import { S3Service } from './aws/S3_bucket/s3.service';

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class ThirdPartyModule {}
