import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import * as path from 'path';
import dayjs from 'dayjs';

export class GetProposalResDto {
  @ApiProperty({
    name: 'proposalId',
    type: Number,
    description: '기획 id',
  })
  @Expose()
  @IsNumber()
  proposalId: number;

  @ApiProperty({
    name: 'plannerId',
    type: Number,
    description: '작성자 id',
  })
  @Expose()
  @IsNumber()
  plannerId: number;

  @ApiProperty({
    name: 'estateId',
    type: Number,
    description: '공간 id',
  })
  @Expose()
  @IsNumber()
  estateId: number;

  @ApiProperty({
    name: 'thumbnail',
    type: String,
    description: '썸네일',
  })
  @Transform(
    ({ value }) =>
      `${path.join(__dirname, '..', '..', '..', 'storage', 'estate')}/${value}`,
  )
  @Expose()
  @IsString()
  thumbnail: string;

  @ApiProperty({
    name: 'opinionOpen',
    type: Boolean,
    description: '의견수렴여부',
  })
  @Expose()
  opinionOpen: boolean;

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
