import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

function transformToUndefinedIfEmpty() {
  return Transform(({ value }) => (value === '' ? undefined : value));
}

export class UpdateUserinfoReqDto {
  @ApiProperty({
    required: false,
    type: String,
    format: 'binary',
    description: '프로필 이미지',
  })
  @transformToUndefinedIfEmpty()
  @IsOptional()
  profileImage: Express.Multer.File | null;

  @ApiProperty({
    required: false,
    type: String,
    maxLength: 50,
    description: '한 줄 소개',
  })
  @transformToUndefinedIfEmpty()
  @IsString()
  @IsOptional()
  baseIntroduction: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: '개인 웹 사이트',
  })
  @transformToUndefinedIfEmpty()
  @IsString()
  @IsOptional()
  websiteUrl: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'sns url',
  })
  @transformToUndefinedIfEmpty()
  @IsString()
  @IsOptional()
  snsUrl: string | null;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: '연락처 공개 여부',
  })
  @transformToUndefinedIfEmpty()
  @IsOptional()
  contactInfoPublic: boolean | null;

  @ApiProperty({
    required: false,
    type: String,
    maxLength: 10,
    description: '닉네임',
  })
  @transformToUndefinedIfEmpty()
  @IsString()
  @IsOptional()
  nickname: string | null;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: '마케팅 수신 동의 여부',
  })
  @transformToUndefinedIfEmpty()
  @IsOptional()
  marketingReception: boolean | null;
}
