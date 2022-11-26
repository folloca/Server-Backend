import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginReqDto {
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
}
