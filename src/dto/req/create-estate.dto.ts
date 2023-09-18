import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class MapCoordinates {
  @ApiProperty({
    name: 'tagNumber',
    type: Number,
    description: '평면도 태그 넘버',
  })
  @IsNumber()
  tagNumber: number;

  @ApiProperty({
    name: 'x',
    type: Number,
    description: '평면도 태그 x 좌표',
  })
  @IsNumber()
  x: number;

  @ApiProperty({
    name: 'y',
    type: Number,
    description: '평면도 태그 y 좌표',
  })
  @IsNumber()
  y: number;
}

export class CreateEstateDto {
  @ApiProperty({
    required: true,
    type: String,
    maxLength: 8,
    description: '공간 이름(최대 8글자)',
  })
  @IsString()
  @IsNotEmpty()
  estateName: string;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 5,
    description: '공간 키워드(최대 5글자)',
  })
  @IsString()
  @IsNotEmpty()
  estateKeyword: string;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 30,
    description: '공간 주제',
  })
  @IsString()
  @IsNotEmpty()
  estateTheme: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: '면적',
  })
  @Type(() => Number)
  @Transform(({ value }) => (value === '' || 0 ? undefined : value))
  @IsNumber()
  @IsOptional()
  extent: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: '수용 인원',
  })
  @Type(() => Number)
  @Transform(({ value }) => (value === '' || 0 ? undefined : value))
  @IsNumber()
  @IsOptional()
  capacity: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: '가격',
  })
  @Type(() => Number)
  @Transform(({ value }) => (value === '' || 0 ? undefined : value))
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: '공간 유형(0: 팝업, 1: 전시)',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  estateUse: number;

  @ApiProperty({
    required: false,
    type: String,
    maxLength: 7,
    description: '해시태그1(최대 7글자)',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  hashTag1: string;

  @ApiProperty({
    required: false,
    type: String,
    maxLength: 7,
    description: '해시태그2(최대 7글자)',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  hashTag2: string;

  @ApiProperty({
    required: true,
    type: String,
    format: 'date-time',
    description: '기획 모집 마감 일자(`YYYY-MM-DD HH:MM`)',
  })
  @IsDateString()
  @IsNotEmpty()
  proposalDeadline: string;

  @ApiProperty({
    required: false,
    type: String,
    maxLength: 120,
    description: '자유로운 한마디',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  ownerMessage: string;

  @ApiProperty({
    required: true,
    type: String,
    format: 'binary',
    description: '대표 이미지',
  })
  @IsOptional()
  thumbnail: Express.Multer.File;

  @ApiProperty({
    required: false,
    type: Array,
    format: 'binary',
    description: '공간 이미지',
  })
  @IsOptional()
  images: Express.Multer.File;

  @ApiProperty({
    required: false,
    type: String,
    format: 'binary',
    description: '평면도',
  })
  @IsOptional()
  map: Express.Multer.File;

  @ApiProperty({
    required: false,
    type: [MapCoordinates],
    description: '평면도 넘버링 태그 좌표',
  })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? Array.from(value).map((el) => JSON.parse(String(el)))
      : plainToInstance(MapCoordinates, JSON.parse(`[${value}]`)),
  )
  @IsOptional()
  numberingCoordinates: MapCoordinates[];
}
