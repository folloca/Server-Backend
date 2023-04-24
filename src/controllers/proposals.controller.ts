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
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ProposalsService } from '../services/proposals.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../utilities/multer.options';
import { GetUserId } from '../custom/decorator/user-id.decorator';
import { CreateProposalDto } from '../dto/req/create-proposal.dto';

@ApiTags('proposals')
@Controller('proposals')
export class ProposalsController {
  constructor(
    private readonly configService: ConfigService,
    private proposalsService: ProposalsService,
  ) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '기획 등록하기 전 필요한 데이터 응답',
    description: '기획 등록 페이지 접속 시 요청',
  })
  @ApiQuery({
    name: 'estateId',
    type: String,
    required: true,
    description: '공간 id',
  })
  async preProposal(@GetUserId() userId, @Query('estateId') estateId) {
    return this.proposalsService.getEstateBeforeProposal(userId, +estateId);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '기획 등록',
    description: '특정 공간 id에 기획 등록',
  })
  @ApiBody({
    type: CreateProposalDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 6 },
      ],
      multerOptions('proposal'),
    ),
  )
  async createEstate(
    @UploadedFiles()
    files: {
      thumbnail: Express.Multer.File;
      images?: Express.Multer.File[];
    },
    @GetUserId() userId,
    @Body() createProposalDto: CreateProposalDto,
  ) {
    const filenames = {
      thumbnail: files.thumbnail[0].filename,
      images: files.images
        ? files.images.map((file) => file.filename)
        : undefined,
    };
    return this.proposalsService.createProposal(
      userId,
      filenames,
      createProposalDto,
    );
  }
}
