import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/baseResponse.dto';

export class CredentialsRegisterResDTO extends BaseResponse {
  @ApiProperty({
    example:
      'Registered Successfully, Verification OTP sent successfully | Verification OTP re-sent successfully | Mail sent to HR : HR@mail.com, to activate the given mail domain !',
  })
  msg: string;
}
