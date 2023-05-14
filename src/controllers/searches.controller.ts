import { Body, Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchesService } from 'src/services/searches.service';

@ApiTags('searches')
@Controller('searches')
export class SearchesController {
  constructor(
    private readonly configService: ConfigService,
    private searchesService: SearchesService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: '검색어 태그 목록',
    description: '검색어 태그 목록',
  })
  async searches(@Body() tags: string[]) {
    return this.searchesService.getHashTagIdByWord(tags);
  }
}
