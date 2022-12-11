import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { KakaoStrategy } from './kakao.strategy';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
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
