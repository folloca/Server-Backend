import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignupReqDto } from '../dto/req/signup-req.dto';
import { LoginReqDto } from '../dto/req/login-req.dto';
import { OauthSignupReqDto } from '../dto/req/oauth-signup-req.dto';
import { LoginResDto } from '../dto/res/login-res.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/redundancy')
  @ApiOperation({
    summary: '이메일 중복 확인',
    description: '이메일 중복 확인',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: '중복 검사하고자 하는 이메일 주소',
  })
  async emailCheck(@Query('email') email: string) {
    return this.authService.emailCheck(email);
  }

  @Get('/forgot-password')
  @ApiOperation({
    summary: '비밀번호 찾기',
    description: '비밀번호 찾기 전에 이메일 주소 확인 후 맞으면 인증번호 발송',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: '비밀번호 찾기 요청하는 이메일 주소',
  })
  async forgotPassword(@Query('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @Get('/verification')
  @ApiOperation({
    summary: '이메일 인증 번호 발송',
    description: '작성한 이메일 주소로 인증 번호 발송',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: '인증 번호 받을 이메일 주소',
  })
  async emailVerification(@Query('email') email: string) {
    return this.authService.emailVerification(email);
  }

  @Get('/number-check')
  @ApiOperation({
    summary: '인증 번호 검수',
    description: '이메일과 인증 번호로 인증 확인',
  })
  @ApiQuery({
    name: 'email',
    required: true,
    description: '인증 번호 받은 이메일 주소',
  })
  @ApiQuery({
    name: 'authNumber',
    required: true,
    description: '검수 인증 번호',
  })
  async authNumberCheck(@Query() query) {
    const { email, authNumber } = query;
    return this.authService.authNumberCheck(email, +authNumber);
  }

  @Post()
  @ApiOperation({
    summary: '회원가입',
    description: '이메일 회원가입',
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        marketingReception: { type: 'boolean' },
        nickname: { type: 'string' },
      },
    },
  })
  async signup(@Body() signupDto: SignupReqDto) {
    const { email, password, marketingReception, nickname } = signupDto;
    return this.authService.signup(
      email,
      password,
      marketingReception,
      nickname,
    );
  }

  @Post('/login')
  @ApiOperation({
    summary: '로그인',
    description: '이메일로 로그인',
  })
  @ApiBody({
    type: LoginReqDto,
  })
  async login(@Body() loginReqDto: LoginReqDto, @Res() res) {
    const { email, password } = loginReqDto;
    const { accessToken, refreshToken, loginResData } =
      await this.authService.login(email, password);

    res
      .setHeader('Authorization', `Bearer ${accessToken}`)
      .cookie('refresh', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(HttpStatus.OK)
      .send({ userData: loginResData, message: `Login success with ${email}` });
  }

  @Delete('/logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃',
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
      },
    },
  })
  async logout(@Res() res, @Body() body) {
    await this.authService.deleteRefreshToken(body.email);
    res
      .setHeader('Authorization')
      .cookie('refresh', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(HttpStatus.OK)
      .send({ message: `Logout success` });
  }

  @Post('/kakao/callback')
  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인 성공시 ',
  })
  @ApiParam({
    name: 'code',
    type: String,
    required: true,
    description: '카카오 로그인 성공 이후 카카오로 부터 전달 받은 인가코드',
  })
  @ApiResponse({
    status: 200,
    description: '카카오 로그인 성공',
    type: LoginResDto,
  })
  @ApiResponse({
    status: 404,
    description: '카카오 로그인 성공은 성공했으나 Folloca User가 아님',
  })
  @ApiResponse({
    status: 409,
    description: '카카오 로그인 성공은 성공했으나 동일 이메일 주소가 있음',
  })
  async requestKakaoLogin(@Body('code') code: string, @Res() res) {
    try {
      const { type, accessToken, refreshToken, loginResData } =
        await this.authService.kakaoLoginLogic(code);

      res
        .setHeader('Authorization', `Bearer ${accessToken}`)
        .cookie('refresh', refreshToken, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .status(type === 'login' ? HttpStatus.OK : HttpStatus.CREATED)
        .send({ userData: loginResData, message: `Login success with kakao` });
    } catch (error) {
      let message = '';

      const userData = error.response;

      switch (error.status) {
        case 404:
          message = `Login fail with kakao`;
          break;
        case 409:
          message = `Already Exist User with Email`;
          break;
        default:
          message = `Unknown error occurred during Kakao Login`;
          break;
      }

      res.status(error.status).send({
        userData: userData,
        message: message,
      });
    }
  }

  @Post('/google/callback')
  async requestGoogleLogin(@Body('tokenId') tokenId: string, @Res() res) {
    try {
      const { type, accessToken, refreshToken, loginResData } =
        await this.authService.googleLoginLogin(tokenId);

      res
        .setHeader('Authorization', `Bearer ${accessToken}`)
        .cookie('refresh', refreshToken, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .status(type === 'login' ? HttpStatus.OK : HttpStatus.CREATED)
        .send({ userData: loginResData, message: `Login success with google` });
    } catch (error) {
      let message = '';

      const userData = error.response;

      switch (error.status) {
        case 404:
          message = `Login fail with google`;
          break;
        case 409:
          message = `Already Exist User with Email`;
          break;
        default:
          message = `Unknown error occurred during Google Login`;
          break;
      }

      res.status(error.status).send({
        userData: userData,
        message: message,
      });
    }
  }

  @Post('/oauth')
  @ApiOperation({
    summary: 'OAuth 회원가입',
    description: '카카오/구글 회원가입',
  })
  @ApiBody({
    schema: {
      properties: {
        oauthId: { type: 'string' },
        registerMethod: { type: 'string' },
        email: { type: 'string' },
        marketingReception: { type: 'boolean' },
        nickname: { type: 'string' },
      },
    },
  })
  async kakaoSignup(@Body() signupDto: OauthSignupReqDto) {
    const { oauthId, registerMethod, email, marketingReception, nickname } =
      signupDto;

    return this.authService.oAuthSignup(
      oauthId,
      registerMethod,
      email,
      marketingReception,
      nickname,
    );
  }

  @Delete('/withdrawal')
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '유저 회원 탈퇴',
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
      },
    },
  })
  async withdrawal(@Res() res, @Body() body) {
    await this.authService.deleteRefreshToken(body.email);
    await this.authService.withdrawal(body.email);

    res
      .setHeader('Authorization')
      .cookie('refresh', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(HttpStatus.OK)
      .send({ message: `Withdrawal success` });
  }
}
