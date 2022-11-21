import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
      },
    },
  })
  async signup(@Body() signupDto: SignupDto) {
    const { email, password, marketingReception } = signupDto;
    return this.authService.signup(email, password, marketingReception);
  }
}
