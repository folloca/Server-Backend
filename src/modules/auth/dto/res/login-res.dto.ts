import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginResDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: '사용자 인덱스',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '닉네임',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '프로필 이미지 저장 경로',
  })
  @IsString()
  @IsNotEmpty()
  profileImagePath: string;
}
