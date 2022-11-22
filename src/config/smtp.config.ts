import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import mjml2html from 'mjml';

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
    const { html } = mjml2html(
      `<mjml>
              <mj-head>
                <mj-font
                  name="Pretendard"
                  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
                />
            
                <mj-attributes>
                  <mj-all font-family="Pretendard, Arial" color="#404040" />
                </mj-attributes>
            
                <mj-style>
                  * { word-break: keep-all; } a { color: #2563eb !important; }
                </mj-style>
              </mj-head>
              <mj-body>
                <mj-section>
                  <mj-column>
                    <!-- Header -->
                    <mj-image
                      width="150px"
                      src=""
                    ></mj-image>
                    <mj-spacer height="20px"></mj-spacer>
                    <mj-divider border-color="#047FFF" border-width="1.5px"></mj-divider>
                    <!-- Main -->
                    <mj-text font-size="16px" line-height="1.5">
                      아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.
                    </mj-text>
                    <mj-text font-size="18px" line-height="1.5">
                      연락처 이메일 👉 ${email}
                    </mj-text>
                    <mj-text font-size="18px" line-height="1.5">
                      인증 번호 6자리 👉 ${authNumber}
                    </mj-text>
                    <mj-text font-size="14px" line-height="1.5" align='center'> FOLLOCA team </mj-text>
                    <!-- Footer -->
                    <mj-divider border-color="#047FFF" border-width="1.5px"></mj-divider>
                    <mj-text
                      align="center"
                      font-family="Pretendard, Arial"
                      font-size="12px"
                      line-height="1"
                    >
                      © 2022 FOLLOCA. All Rights Reserved.
                    </mj-text>
                  </mj-column>
                </mj-section>
              </mj-body>
            </mjml>`,
    );

    const mailOptions = {
      to: email,
      subject: '[FOLLOCA] 이메일 인증 번호 안내',
      html: html,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
