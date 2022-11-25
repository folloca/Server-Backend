import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
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
    type: String,
    description: '비밀번호',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

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
