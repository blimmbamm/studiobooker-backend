import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = createTransport({
    host: 'localhost', // SMTP4DEV hostname
    port: 2525, // SMTP4DEV port
    secure: false, // No TLS for local development
    // auth: {},
  });

  async sendEmail(to: string, subject: string, text: string) {
    this.transporter.sendMail({
      from: '"No Reply" <noreply@example.com>',
      to,
      subject,
      text,
    });
  }
}
