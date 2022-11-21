import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../database/repositories/user.repository';
import { SmtpConfig } from '../../config/smtp.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 4;

  constructor(
    private readonly configService: ConfigService,
    private userRepository: UserRepository,
    private smtpConfig: SmtpConfig,
  ) {}

  async emailCheck(email) {
    const accountInfo = await this.userRepository.findAccountByEmail(email);

    if (accountInfo) {
      return {
        message: `Email ${email} is already registered with ${accountInfo}`,
      };
    } else {
      return { message: `No account with ${email}` };
    }
  }

  async emailVerification(email) {
    const authNumber = Math.floor(Math.random() * 888888) + 111111;
    await this.smtpConfig.sendEmailVerification(email, authNumber);

    return {
      authNumber: authNumber,
      message: `Verification email is sent to ${email}`,
    };
  }

  async signup(email, password, marketingReception, nickname) {
    const salt = await bcrypt.genSalt(this.SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepository
      .createUserData(
        email,
        hashedPassword,
        nickname,
        marketingReception,
        'EMAIL',
      )
      .then(() => {
        return {
          message: `Successfully created new user data: ${email}`,
        };
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}
