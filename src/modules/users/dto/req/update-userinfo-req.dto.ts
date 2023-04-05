import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class UpdateUserinfoReqDto {
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
  baseIntroduction?: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '개인 웹 사이트',
  })
  websiteUrl?: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'sns url',
  })
  snsUrl?: string;

  @ApiProperty({
    required: true,
    type: Boolean,
    description: '연락처 공개 여부',
  })
  @IsBooleanString()
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
    type: Boolean,
    description: '마케팅 수신 동의 여부',
  })
  @IsBooleanString()
  @IsNotEmpty()
  marketingReception: boolean;
}
