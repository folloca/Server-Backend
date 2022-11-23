import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';

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

  @Get('/auth-number')
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
  async signup(@Body() signupDto: SignupDto) {
    const { email, password, marketingReception, nickname } = signupDto;
    return this.authService.signup(
      email,
      password,
      marketingReception,
      nickname,
    );
  }
}
