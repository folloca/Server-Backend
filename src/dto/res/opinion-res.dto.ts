import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class OpinionResDto {
  @ApiProperty({
    name: 'proposalId',
    type: String,
    description: '기획 고유 번호',
  })
  @Expose()
  @IsNumber()
  proposalId: number;
  @ApiProperty({
    name: 'nickname',
    type: String,
    description: '등록자 닉네임',
  })
  @Expose()
  @IsString()
  nickname: string;

  @ApiProperty({
    name: 'estateName',
    type: String,
    description: '공간 명',
  })
  @Expose()
  @IsString()
  estateName: string;

  @ApiProperty({
    name: 'proposalIntroduction',
    type: String,
    description: '공간 한줄 소개',
  })
  @Expose()
  @IsString()
  proposalIntroduction: string;

  @ApiProperty({
    name: 'opinionText',
    type: String,
    description: '공간 한줄 소개',
  })
  @Expose()
  @IsString()
  opinionText: string;

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
