import {
  BadRequestException,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../database/repositories/user.repository';
import { SmtpConfig } from '../../config/smtp.config';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { LoginResDto } from './dto/res/login-res.dto';
import { Redis } from 'ioredis';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 4;

  constructor(
    private readonly configService: ConfigService,
    private userRepository: UserRepository,
    private smtpConfig: SmtpConfig,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async emailCheck(email: string) {
    const accountInfo = await this.userRepository.findAccountByEmail(email);

    if (accountInfo) {
      return {
        message: `Email ${email} is already registered with ${accountInfo.registerMethod}`,
      };
    } else {
      return { message: `No account with ${email}` };
    }
  }

  async emailVerification(email: string) {
    const authNumber = Math.floor(Math.random() * 888888) + 111111;
    await this.smtpConfig.sendEmailVerification(email, authNumber);

    await this.cacheManager.set(`authNum_${email}`, authNumber, 30000);

    return {
      message: `Verification email is sent to ${email}`,
    };
  }

  async authNumberCheck(email: string, authNumber: number): Promise<object> {
    const value = await this.cacheManager.get(`authNum_${email}`);
    console.log(value);

    let result: boolean;
    authNumber === value ? (result = true) : (result = false);

    return {
      authNumberValidity: result,
      message: `Auth number identify result of ${email}`,
    };
  }

  async signup(
    email: string,
    password: string,
    marketingReception: boolean,
    nickname: string,
  ) {
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

  getAccessToken(userId: number, email: string) {
    const payload = { userId, email };
    return this.jwtService.signAsync(payload);
  }

  getRefreshToken(userId: number, email: string) {
    const payload = { userId, email };
    return this.jwtService.signAsync(payload, { expiresIn: '30d' });
  }

  validateRefreshToken(userId, refreshToken) {
    const userData = this.userRepository.getUserData(userId);

    return true;
  }

  async login(email: string, password: string) {
    const emailValidity = await this.userRepository.findAccountByEmail(email);

    if (!emailValidity) {
      throw new NotFoundException(`No account with ${email}`);
    }

    const userData = await this.userRepository.getUserData(
      emailValidity.userId,
    );
    const passwordVerification = await bcrypt.compare(
      password,
      userData.password,
    );

    if (!passwordVerification) {
      throw new BadRequestException('Invalid password');
    } else {
      const accessToken = this.getAccessToken(userData.userId, userData.email);
      const refreshToken = this.getRefreshToken(
        userData.userId,
        userData.email,
      );
      const loginResData = plainToInstance(LoginResDto, userData, {
        excludeExtraneousValues: true,
      });

      return { accessToken, refreshToken, loginResData };
    }
  }
}
