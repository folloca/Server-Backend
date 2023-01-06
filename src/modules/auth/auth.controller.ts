import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { KakaoStrategy } from './jwt/kakao.strategy';
import { SignupReqDto } from './dto/req/signup-req.dto';
import { LoginReqDto } from './dto/req/login-req.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/redundancy-check/:email')
  @ApiOperation({
    summary: '이메일 중복 확인',
    description: '이메일 중복 확인',
  })
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
    description: '중복 검사하고자 하는 이메일 주소',
  })
  async emailCheck(@Param('email') email: string) {
    return this.authService.emailCheck(email);
  }

  @Get('/verification/:email')
  @ApiOperation({
    summary: '이메일 인증',
    description: '작성한 이메일 주소로 인증 번호 발송',
  })
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
    description: '인증 번호 받을 이메일 주소',
  })
  async emailVerification(@Param('email') email: string) {
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
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
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

  @Post('/kakao')
  @HttpCode(200)
  @ApiParam({
    name: 'code',
    type: String,
    required: true,
    description: '카카오 로그인 성공 이후 카카오로 부터 전달 받은 인가코드',
  })
  async requestKakaoLogin(@Body('code') code: string, @Res() res) {
    const kakao = new KakaoStrategy();

    const tokens = await kakao.getToken(code);
    const userInfo = await kakao.getUserInfo(tokens.access_token);

    const findUser = this.authService.kakaoCheck(String(userInfo.target_id));

    // #12 merge 진행 가능 예정 login-res.dto.ts
    // if (findUser) {
    //   res.statusCode(HttpStatus.OK).send({
    //     email: findUser.email,
    //   });
    // } else {
    //   res.statusCode(HttpStatus.NOT_FOUND).send({
    //     email: null,
    //   });
    // }
  }
}
