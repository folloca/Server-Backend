import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import * as path from 'path';
import dayjs from 'dayjs';

export class GetEstateResDto {
  @ApiProperty({
    name: 'estateId',
    type: Number,
    description: '공간 id',
  })
  @Expose()
  @IsNumber()
  estateId: number;

  @ApiProperty({
    name: 'ownerId',
    type: Number,
    description: '소유자 id',
  })
  @Expose()
  @IsNumber()
  ownerId: number;

  @ApiProperty({
    name: 'thumbnailPath',
    type: String,
    description: '대표 이미지 경로',
  })
  @Transform(
    ({ value }) =>
      `${path.join(__dirname, '..', '..', '..', 'storage', 'estate')}/${value}`,
  )
  @Expose({ name: 'thumbnail' })
  @IsString()
  thumbnailPath: string;

  @ApiProperty({
    name: 'estateName',
    type: String,
    description: '공간 이름',
  })
  @Expose()
  @IsString()
  estateName: string;

  @ApiProperty({
    name: 'estateKeyword',
    type: String,
    description: '공간 키워드',
  })
  @Expose()
  @IsString()
  estateKeyword: string;

  @ApiProperty({
    name: 'estateTheme',
    type: String,
    description: '공간 주제',
  })
  @Expose()
  @IsString()
  estateTheme: string;

  @ApiProperty({
    name: 'estateUse',
    type: String,
    description: '공간 유형',
  })
  @Transform(({ value }) => (value === 0 ? '팝업' : '전시'))
  @Expose()
  @IsString()
  estateUse: string;

  @ApiProperty({
    name: 'extent',
    type: Number,
    description: '면적',
  })
  @Expose()
  @IsNumber()
  extent: number;

  @ApiProperty({
    name: 'capacity',
    type: Number,
    description: '수용 인원',
  })
  @Expose()
  @IsNumber()
  capacity: number;

  @ApiProperty({
    name: 'price',
    type: Number,
    description: '가격',
  })
  @Expose()
  @IsNumber()
  price: number;

  @ApiProperty({
    name: 'ownerMessage',
    type: String,
    description: '공간 소유자의 한마디',
  })
  @Expose()
  @IsString()
  ownerMessage: string;

  @ApiProperty({
    name: 'proposalDeadline',
    type: String,
    description: '기획 마감 일자',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  @Expose()
  @IsString()
  proposalDeadline: string;

  @ApiProperty({
    name: 'createdAt',
    type: String,
    description: '등록 일자',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  @Expose()
  @IsString()
  createdAt: string;

  @ApiProperty({
    name: 'updatedAt',
    type: String,
    description: '수정 일자',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  @Expose()
  @IsString()
  updatedAt: string;
}
