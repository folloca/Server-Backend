import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchesService } from 'src/services/searches.service';

@ApiTags('searches')
@Controller('searches')
export class SearchesController {
  constructor(
    private readonly configService: ConfigService,
    private searchesService: SearchesService,
  ) {}

  @Get('/')
  @ApiQuery({
    name: 'tags',
    type: Array,
    required: true,
    description: '검색어 태그 리스트',
  })
  @ApiOperation({
    summary: '검색어 태그 목록',
    description: '검색어 태그 목록',
  })
  async searches(@Query() tags: string[]) {
    return this.searchesService.getHashTagIdByWord(tags['tags']);
  }
}
