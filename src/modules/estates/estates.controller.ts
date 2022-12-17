import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EstatesService } from './estates.service';
import { CreateEstateDto } from './dto/req/create-estate.dto';

@ApiTags('estates')
@Controller('estates')
export class EstatesController {
  constructor(private estatesService: EstatesService) {}

  @Get('/popularity')
  @ApiOperation({
    summary: '인기순 조회',
    description: '인기순 정렬 조회(트렌드 페이지)',
  })
  async getEstateListByPopularity() {
    return this.estatesService.getEstateListByPopularity();
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
}
