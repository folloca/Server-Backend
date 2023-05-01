import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import * as path from 'path';
import dayjs from 'dayjs';

export class GetLinkingResDto {
  @ApiProperty({
    name: 'linkingId',
    type: Number,
    description: '링킹 id',
  })
  @Expose()
  @IsNumber()
  linkingId: number;

  @ApiProperty({
    name: 'organizerId',
    type: Number,
    description: '작성자 id',
  })
  @Expose()
  @IsNumber()
  organizerId: number;

  @ApiProperty({
    name: 'nickname',
    type: String,
    description: '작성자 nickname',
  })
  @Expose()
  @IsString()
  nickname: string;

  @ApiProperty({
    name: 'linkingTitle',
    type: String,
    description: '링킹 제목',
  })
  @Expose()
  @IsString()
  linkingTitle: string;

  @ApiProperty({
    name: 'selfIntroduction',
    type: String,
    description: '작성자 소개',
  })
  @Expose()
  @IsString()
  selfIntroduction: string;

  @ApiProperty({
    name: 'topic',
    type: String,
    description: '링킹 주제',
  })
  @Expose()
  @IsString()
  topic: string;

  @ApiProperty({
    name: 'taskObject',
    type: String,
    description: '링킹 목적',
  })
  @Expose()
  @IsString()
  taskObject: string;

  @ApiProperty({
    name: 'memberCount',
    type: Number,
    description: '링킹 모집 인원 수',
  })
  @Expose()
  @IsNumber()
  memberCount: number;

  @ApiProperty({
    name: 'hope',
    type: String,
    description: '바라는 점',
  })
  @Expose()
  @IsString()
  hope: string;

  @ApiProperty({
    name: 'thumbnailPath',
    type: String,
    description: '썸네일',
  })
  @Transform(
    ({ value }) =>
      `${path.join(__dirname, '..', '..', '..', 'storage', 'estate')}/${value}`,
  )
  @Expose()
  @IsString()
  thumbnailPath: string;

  @ApiProperty({
    name: 'mapImagePath',
    type: String,
    description: '지도 썸네일',
  })
  @Transform(
    ({ value }) =>
      `${path.join(__dirname, '..', '..', '..', 'storage', 'estate')}/${value}`,
  )
  @Expose()
  @IsString()
  mapImagePath: string;

  @ApiProperty({
    name: 'recruitInProgress',
    type: Boolean,
    description: '모집 완료 여부',
  })
  @Expose()
  recruitInProgress: boolean;

  @ApiProperty({
    name: 'linkingDeadline',
    type: String,
    description: '링킹 모집 마감일자',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  @Expose()
  @IsString()
  linkingDeadline: string;

  @ApiProperty({
    name: 'createdAt',
    type: String,
    description: '등록 일자',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  @Expose()
  @IsString()
  createdAt: string;
}
