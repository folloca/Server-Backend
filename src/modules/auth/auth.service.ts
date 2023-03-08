import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../repositories/user.repository';
import { SmtpConfig } from '../../config/smtp.config';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { LoginResDto } from './dto/res/login-res.dto';
import * as bcrypt from 'bcrypt';
import { KakaoStrategy } from './jwt/kakao.strategy';
import { KakaoUserInfosResDto } from './dto/res/kakao-userInfo-res.dto';
import { GoogleStrategy } from './jwt/google.strategy';

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

    if (!accountInfo) {
      throw new HttpException(`No account with ${email}`, HttpStatus.NOT_FOUND);
    } else {
      return {
        message: `Email ${email} is already registered with ${accountInfo.registerMethod}`,
      };
    }
  }

  async forgotPassword(email: string) {
    const accountInfo = await this.userRepository.findAccountByEmail(email);

    if (!accountInfo) {
      throw new HttpException(`No account with ${email}`, HttpStatus.NOT_FOUND);
    } else {
      await this.emailVerification(email);
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

  async oAuthSignup(
    oauthId: string,
    registerMethod: string,
    email: string,
    marketingReception?: boolean,
    nickname?: string,
  ) {
    await this.userRepository.createUserOauthData(
      email,
      oauthId,
      nickname,
      marketingReception,
      registerMethod,
    );
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

  async deleteRefreshToken(email: string) {
    await this.cacheManager.del(`refresh_${email}`);
  }

  async kakaoCheck(userInfo: KakaoUserInfosResDto) {
    const accountInfo = await this.userRepository.findAccountByOauthId(
      String(userInfo.id),
      'KAKAO',
    );

    if (accountInfo) {
      const accessToken = await this.getAccessToken(
        accountInfo.userId,
        accountInfo.email,
      );
      const refreshToken = await this.getRefreshToken(
        accountInfo.userId,
        accountInfo.email,
      );
      const loginResData = plainToInstance(LoginResDto, accountInfo, {
        excludeExtraneousValues: true,
      });

      return { type: 'login', accessToken, refreshToken, loginResData };
    } else {
      const { id } = userInfo;

      const email = userInfo.kakao_account.email
        ? userInfo.kakao_account.email
        : null;

      if (email != null) {
        const existUser = await this.userRepository.findAccountByEmail(email);
        if (existUser && existUser.registerMethod !== 'KAKAO') {
          throw new ConflictException({
            userId: existUser.userId,
            email: existUser.email,
          });
        } else {
          await this.oAuthSignup(id.toString(), 'KAKAO', email);
          const createdUser = await this.userRepository.findAccountByOauthId(
            String(userInfo.id),
            'KAKAO',
          );
          if (createdUser) {
            const accessToken = await this.getAccessToken(
              createdUser.userId,
              email,
            );
            const refreshToken = await this.getRefreshToken(
              createdUser.userId,
              email,
            );
            const loginResData = plainToInstance(LoginResDto, createdUser, {
              excludeExtraneousValues: true,
            });

            return { type: 'regist', accessToken, refreshToken, loginResData };
          }
        }
      }

      const profile_image_url =
        userInfo.kakao_account.profile &&
        !userInfo.kakao_account.profile.is_default_image
          ? userInfo.kakao_account.profile.profile_image_url
          : null;

      throw new NotFoundException({
        id: id,
        email: email,
        profileImageUrl: profile_image_url,
      });
    }
  }

  async kakaoLoginLogic(code: string) {
    const kakao = new KakaoStrategy(this.configService);

    const tokens = await kakao.getToken(code);
    const userInfo = await kakao.getUserInfo(tokens.access_token);

    const { type, accessToken, refreshToken, loginResData } =
      await this.kakaoCheck(userInfo);

    return { type, accessToken, refreshToken, loginResData };
  }

  async googleLoginLogin(idToken: string) {
    const google = new GoogleStrategy(this.configService);

    const { oauthId, email, profile_image } = await google.getUserId(idToken);

    const { type, accessToken, refreshToken, loginResData } =
      await this.googleCheck(oauthId, email, profile_image);

    return { type, accessToken, refreshToken, loginResData };
  }

  async googleCheck(oauthId: string, email: string, profile_image: string) {
    const accountInfo = await this.userRepository.findAccountByOauthId(
      String(oauthId),
      'GOOGLE',
    );

    if (accountInfo) {
      const accessToken = await this.getAccessToken(
        +accountInfo.oauthId,
        accountInfo.email,
      );
      const refreshToken = await this.getRefreshToken(
        +accountInfo.oauthId,
        accountInfo.email,
      );
      const loginResData = plainToInstance(LoginResDto, accountInfo, {
        excludeExtraneousValues: true,
      });

      return { type: 'login', accessToken, refreshToken, loginResData };
    } else {
      // const { id } = userInfo;

      if (email != null) {
        const existUser = await this.userRepository.findAccountByEmail(email);
        if (existUser && existUser.registerMethod !== 'GOOGLE') {
          throw new ConflictException({
            userId: existUser.userId,
            email: existUser.email,
          });
        } else {
          await this.oAuthSignup(oauthId, 'GOOGLE', email);
          const createdUser = await this.userRepository.findAccountByOauthId(
            oauthId,
            'GOOGLE',
          );
          if (createdUser) {
            const accessToken = await this.getAccessToken(
              createdUser.userId,
              email,
            );
            const refreshToken = await this.getRefreshToken(
              createdUser.userId,
              email,
            );
            const loginResData = plainToInstance(LoginResDto, createdUser, {
              excludeExtraneousValues: true,
            });

            return { type: 'regist', accessToken, refreshToken, loginResData };
          }
        }
      }

      const profile_image_url = profile_image ? profile_image : null;

      throw new NotFoundException({
        id: oauthId,
        email: email,
        profileImageUrl: profile_image_url,
      });
    }
  }
}
