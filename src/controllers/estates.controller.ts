import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EstatesService } from '../services/estates.service';
import { CreateEstateDto } from '../dto/req/create-estate.dto';
import {
  PriorFilterEnumToKor,
  PriorFilterEnumToEng,
} from '../custom/enum/prior-filter.enum';
import {
  PosteriorFilterEnumToKor,
  PosteriorFilterEnumToEng,
} from '../custom/enum/posterior-filter.enum';
import { ConfigService } from '@nestjs/config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../utilities/multer.options';
import { GetUserId } from '../custom/decorator/user-id.decorator';
import * as os from 'os';

@ApiTags('estates')
@Controller('estates')
export class EstatesController {
  private readonly estateImagePath;
  constructor(
    private readonly configService: ConfigService,
    private estatesService: EstatesService,
  ) {
    const storagePath = this.configService.get<string>(
      `${process.env.NODE_ENV}.storage.estate`,
    );
    this.estateImagePath = storagePath.replace('user.home', os.homedir());
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
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '공간 등록',
    description: '공간 등록',
  })
  @ApiBody({
    type: CreateEstateDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 7 },
        { name: 'map', maxCount: 1 },
      ],
      multerOptions('estate'),
    ),
  )
  async createEstate(
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; map?: Express.Multer.File[] },
    @GetUserId() userId,
    @Body() createEstateDto: CreateEstateDto,
  ) {
    return this.estatesService.createEstate(userId, createEstateDto);
  }

  @Post('/like')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '공간 좋아요/취소',
    description: '공간 게시물 id를 받아 좋아요 추가 및 취소',
  })
  @ApiQuery({
    name: 'estateId',
    type: String,
    required: true,
    description: '공간 id',
  })
  async estateLikeUnlike(@Query() query, @GetUserId() userId) {
    const { estateId } = query;
    return this.estatesService.estateLikeUnlike(estateId, userId);
  }

  @Delete()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '공간 삭제',
    description: '공간 게시물 id를 받아 토큰 검증 후 삭제',
  })
  @ApiQuery({
    name: 'estateId',
    type: String,
    required: true,
    description: '공간 id',
  })
  async deleteEstate(@Query() query, @GetUserId() userId) {
    const { estateId } = query;
    return this.estatesService.deleteEstate(+estateId, userId);
  }
}