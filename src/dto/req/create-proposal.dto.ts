import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export interface ProposalDetailsDto {
  [key: number]: string;
}

export class CreateProposalDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: '공간 id',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  estateId: number;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 20,
    description: '한 줄 소개(20자 이내)',
  })
  @IsString()
  @IsNotEmpty()
  proposalIntroduction: string;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 200,
    description: '설명(200자 이내)',
  })
  @IsString()
  @IsNotEmpty()
  proposalDescription: string;

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
    required: false,
    type: Object,
    additionalProperties: {
      type: 'string',
    },
    description:
      '구체화 방안(평면도가 존재하지 않을 경우, "0"을 key로 string value 1200자까지 하나만 작성 가능)',
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsOptional()
  proposalDetails: ProposalDetailsDto;

  @ApiProperty({
    required: true,
    type: Boolean,
    description: '의견 받기 여부',
  })
  @IsBooleanString()
  @IsNotEmpty()
  opinionOpen: boolean;

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
    description: '기획 이미지(최대 6장)',
  })
  @IsOptional()
  images: Express.Multer.File;
}
