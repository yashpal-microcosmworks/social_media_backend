import { Injectable } from '@nestjs/common';
import { CustomLogger } from './logger/custom-logger.service';
import { SesService } from 'src/third-party/aws/SES/ses.service';
import { sendTextMailInterface } from './interfaces';

@Injectable()
export class EmailService {
  constructor(
    private readonly sesService: SesService,
    private readonly logger: CustomLogger,
  ) {}

  async sendTextMail({
    toEmail,
    fromEmail,
    subject,
    textBody,
    html,
  }: sendTextMailInterface) {
    try {
      await this.sesService.sendEmail(
        toEmail,
        fromEmail,
        subject,
        textBody,
        html,
      );
    } catch (error) {
      throw error;
    }
  }

  async sendBatchEmail(data: sendTextMailInterface[]) {
    const results = await Promise.allSettled(
      data.map((item) => this.sendTextMail(item)),
    );

    return results;
  }
}
