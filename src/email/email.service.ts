import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly fromMail: string;

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    this.fromMail = this.config.get<string>('FROM_MAIL') || '';
  }

  async sendEmail(to: string, subject: string, text: string) {
    this.resend.emails.send({
      from: this.fromMail,
      to,
      subject,
      html: text,
    });
  }
}
