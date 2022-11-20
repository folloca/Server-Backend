import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SmtpConfig {
  private transporter: Mail;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: configService.get<string>(
        `${process.env.NODE_ENV}.auth.smtp.service`,
      ),
      auth: {
        user: configService.get<string>(
          `${process.env.NODE_ENV}.auth.smtp.user`,
        ),
        pass: configService.get<string>(
          `${process.env.NODE_ENV}.auth.smtp.password`,
        ),
      },
    });
  }

  async sendEmailVerification(email: string, authNumber: number) {
    const mailOptions = {
      from: 'folloca team',
      to: email,
      subject: '[FOLLOCA] 이메일 인증번호 안내',
      text: `아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n
    연락처 이메일 👉 ${email}\n
    인증번호 6자리 👉 ${authNumber}`,
      // html: ``
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
