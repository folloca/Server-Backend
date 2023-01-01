import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EstatesService } from './estates.service';
import { CreateEstateDto } from './dto/req/create-estate.dto';
import {
  PriorFilterEnumToKor,
  PriorFilterEnumToEng,
} from './enum/prior-filter.enum';
import {
  PosteriorFilterEnumToKor,
  PosteriorFilterEnumToEng,
} from './enum/posterior-filter.enum';

@ApiTags('estates')
@Controller('estates')
export class EstatesController {
  constructor(private estatesService: EstatesService) {}

  @Get('/popularity')
  @ApiOperation({
    summary: '공간 리스트 인기순 조회',
    description: '인기순 정렬 조회(트렌드 페이지)',
  })
  async getEstateListByPopularity() {
    return this.estatesService.getEstateListByPopularity();
  }

  @Get()
  @ApiOperation({
    summary: '공간 리스트 필터 조회',
    description: '공간 페이지 필터 조회',
  })
  @ApiQuery({
    name: 'priorFilter',
    enum: PriorFilterEnumToKor,
    description: '기획 모집 마감 여부 필터링',
  })
  @ApiQuery({
    name: 'posteriorFilter',
    enum: PosteriorFilterEnumToKor,
    description: '시간순 필터링',
  })
  async getEstateList(@Query() query) {
    const { priorFilter, posteriorFilter } = query;
    return this.estatesService.getEstateList(
      PriorFilterEnumToEng[priorFilter],
      PosteriorFilterEnumToEng[posteriorFilter],
    );
  }

  @Post()
  @ApiOperation({
    summary: '공간 등록',
    description: '공간 등록',
  })
  @ApiBody({
    type: CreateEstateDto,
  })
  async createEstate(@Body() createEstateDto: CreateEstateDto) {
    return this.estatesService.createEstate(createEstateDto);
  }

  @Post('/like/:estateId')
  @ApiOperation({
    summary: '공간 좋아요/취소',
    description: '공간 게시물 id를 받아 좋아요 추가 및 취소',
  })
  @ApiParam({
    name: 'estateId',
    type: String,
    required: true,
    description: '공간 id',
  })
  async estateLikeUnlike(@Param('estateId') estateId: string) {
    return this.estatesService.estateLikeUnlike(+estateId);
  }
}
