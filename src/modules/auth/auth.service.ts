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

    const data = authNumber + '_' + new Date();

    await this.cacheManager.set(`authNum_${email}`, data);

    return {
      message: `Verification email is sent to ${email}`,
    };
  }

  async authNumberCheck(email: string, authNumber: number): Promise<object> {
    const data = await this.cacheManager.get(`authNum_${email}`);
    const value = +String(data).split('_')[0];
    const savedTime = new Date(String(data).split('_')[1]);

    const validTime = new Date();
    validTime.setMinutes(validTime.getMinutes() - 3);

    let result: boolean;
    if (validTime > savedTime) {
      result = false;
      await this.cacheManager.del(`authNum_${email}`);
    } else if (authNumber !== value) {
      result = false;
    } else {
      result = true;
      await this.cacheManager.del(`authNum_${email}`);
    }

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

  async getRefreshToken(userId: number, email: string) {
    const payload = { userId, email };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get(
        `${process.env.NODE_ENV}.auth.refresh_secret`,
      ),
      expiresIn: '14d',
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, this.SALT_ROUND);

    await this.cacheManager.set(`refresh_${email}`, hashedRefreshToken);

    return refreshToken;
  }

  async validateRefreshToken(userId, email, refreshToken) {
    const tokenData = await this.cacheManager.get<string>(`refresh_${email}`);
    const tokenVerification = await bcrypt.compare(refreshToken, tokenData);

    if (tokenVerification) {
      return this.userRepository.getUserData(userId);
    } else {
      throw new BadRequestException('Invalid Token');
    }
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
      const accessToken = await this.getAccessToken(
        userData.userId,
        userData.email,
      );
      const refreshToken = await this.getRefreshToken(
        userData.userId,
        userData.email,
      );
      const loginResData = plainToInstance(LoginResDto, userData, {
        excludeExtraneousValues: true,
      });

      return { accessToken, refreshToken, loginResData };
    }
  }

  async kakaoCheck(kakaoId: string) {
    const accountInfo = await this.userRepository.findAccountByKakaoId(kakaoId);

    if (accountInfo) return accountInfo;
    else return false;
  }
}
