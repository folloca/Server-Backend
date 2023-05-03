import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class LinkingRequestResDto {
  @ApiProperty({
    name: 'linkingId',
    type: Number,
    description: '링킹 고유번호',
  })
  @Expose()
  @IsNumber()
  linkingId: number;

  @ApiProperty({
    name: 'linkingTitle',
    type: String,
    description: '링킹 제목',
  })
  @Expose()
  @IsString()
  linkingTitle: string;

  @ApiProperty({
    name: 'participateMessage',
    type: String,
    description: '참여 메시지',
  })
  @Expose()
  @IsString()
  participateMessage: string;

  @ApiProperty({
    name: 'memberCount',
    type: Number,
    description: '참여 인원수',
  })
  @Expose()
  @IsNumber()
  memberCount: number;

  @ApiProperty({
    name: 'linkingDeadline',
    type: String,
    description: '등록 일자',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  @Expose()
  @IsString()
  linkingDeadline: string;

  @ApiProperty({
    name: 'recruitInProgress',
    type: Boolean,
    description: '링킹 모집 여부',
  })
  @Expose()
  @IsNumber()
  recruitInProgress: boolean;

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
