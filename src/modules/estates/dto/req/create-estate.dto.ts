import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEstateDto {
  @ApiProperty({
    required: true,
    type: String,
    maxLength: 8,
    description: '공간 이름',
  })
  @IsString()
  @IsNotEmpty()
  estateName: string;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 5,
    description: '공간 키워드',
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
  @IsNumber()
  extent: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: '수용 인원',
  })
  @IsNumber()
  capacity: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: '가격',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 30,
    description: '공간 유형',
  })
  @IsString()
  @IsNotEmpty()
  estateUse: string;

  @ApiProperty({
    required: true,
    type: Date,
    description: '기획 모집 마감 일자',
  })
  @IsDateString()
  @IsNotEmpty()
  proposalDeadline: Date;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 120,
    description: '자유로운 한마디',
  })
  @IsString()
  @IsNotEmpty()
  ownerMessage: string;
}
