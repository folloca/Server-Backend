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
    name: 'estateName',
    type: String,
    description: '공간명',
  })
  @Expose()
  @IsString()
  estateName: string;

  @ApiProperty({
    name: 'nickname',
    type: String,
    description: '작성자 닉네임',
  })
  @Expose()
  @IsString()
  nickname: string;

  @ApiProperty({
    name: 'thumbnail',
    type: String,
    description: '썸네일',
  })
  @Transform(
    ({ value }) =>
      `${path.join(
        __dirname,
        '..',
        '..',
        '..',
        'storage',
        'proposal',
      )}/${value}`,
  )
  @Expose()
  @IsString()
  thumbnail: string;

  @ApiProperty({
    name: 'proposalIntroduction',
    type: String,
    description: '한줄소개',
  })
  @Expose()
  @IsString()
  proposalIntroduction: string;

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
