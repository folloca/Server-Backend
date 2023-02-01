import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OauthSignupReqDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '카카오 로그인 실패(NOT FOUND)시 백엔드로 부터 받은 kakaoId',
  })
  @IsNotEmpty()
  oauthId: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'account Type',
  })
  @IsNotEmpty()
  registerMethod: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '이메일',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    type: Boolean,
    description: '마케팅 수신 동의 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  marketingReception: boolean;

  @ApiProperty({
    required: true,
    type: String,
    description: '닉네임',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
