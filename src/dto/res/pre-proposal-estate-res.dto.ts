import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import * as path from 'path';
import dayjs from 'dayjs';

export class PreProposalEstateResDto {
  @ApiProperty({
    name: 'estateId',
    type: Number,
    description: '공간 id',
  })
  @Expose()
  @IsNumber()
  estateId: number;

  @ApiProperty({
    name: 'estateKeyword',
    type: String,
    description: '공간 키워드',
  })
  @Expose()
  @IsString()
  estateKeyword: string;

  @ApiProperty({
    name: 'estateName',
    type: String,
    description: '공간 이름',
  })
  @Expose()
  @IsString()
  estateName: string;

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
    name: 'proposalDeadline',
    type: String,
    description: '기획 마감 일자',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  @Expose()
  @IsString()
  proposalDeadline: string;

  @ApiProperty({
    name: 'contactInfoPublic',
    type: Boolean,
    description: '연락처 공개 여부',
  })
  @Expose()
  @IsBoolean()
  contactInfoPublic: boolean;

  @ApiProperty({
    name: 'mapImagePath',
    type: String,
    description: '평면도 이미지 경로',
  })
  @Transform(
    ({ value }) =>
      `${path.join(__dirname, '..', '..', '..', 'storage', 'estate')}/${value}`,
  )
  @Expose({ name: 'mapImage' })
  @IsString()
  mapImagePath: string;

  @ApiProperty({
    name: 'numberingData',
    isArray: true,
    description: '넘버링 태그 데이터',
  })
  @Expose()
  @IsArray()
  numberingData: { tagNumber: number; coordinate: [number, number] }[];
}
