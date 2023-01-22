import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class UpdateUserinfoReqDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: '사용자 인덱스',
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    required: true,
    type: String,
    format: 'binary',
    description: '프로필 이미지',
  })
  profileImage: Express.Multer.File;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 50,
    description: '한 줄 소개',
  })
  @IsNotEmpty()
  baseIntroduction: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '개인 웹 사이트',
  })
  @IsNotEmpty()
  websiteUrl: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'sns url',
  })
  @IsNotEmpty()
  snsUrl: string;

  @ApiProperty({
    required: true,
    type: Boolean,
    description: '연락처 공개 여부',
  })
  @IsBooleanString()
  @IsNotEmpty()
  contactInfoPublic: boolean;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 10,
    description: '닉네임',
  })
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '비밀번호',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: true,
    type: Boolean,
    description: '마케팅 수신 동의 여부',
  })
  @IsBooleanString()
  @IsNotEmpty()
  marketingReception: boolean;
}
