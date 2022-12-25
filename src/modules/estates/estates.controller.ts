import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../utilities/multer.options';
import { ConfigService } from '@nestjs/config';

let estateImagePath;

@ApiTags('estates')
@Controller('estates')
export class EstatesController {
  constructor(
    private readonly configService: ConfigService,
    private estatesService: EstatesService,
  ) {
    estateImagePath = this.configService.get<string>(
      `${process.env.NODE_ENV}.images.estate`,
    );
  }

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
    summary: '공간 등록(미완료)',
    description: '공간 등록',
  })
  @ApiBody({
    type: CreateEstateDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 6 },
        { name: 'map', maxCount: 1 },
      ],
      multerOptions('estate'),
    ),
  )
  async createEstate(
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; map?: Express.Multer.File[] },
    @Body() createEstateDto: CreateEstateDto,
  ) {
    return this.estatesService.createEstate(createEstateDto);
  }
}
