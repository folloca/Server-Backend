import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ProposalsService } from '../services/proposals.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../utilities/multer.options';
import { GetUserId } from '../custom/decorator/user-id.decorator';
import { CreateProposalDto } from '../dto/req/create-proposal.dto';
import { UpdateProposalDto } from '../dto/req/update-proposal.dto';

@ApiTags('proposals')
@Controller('proposals')
export class ProposalsController {
  constructor(
    private readonly configService: ConfigService,
    private proposalsService: ProposalsService,
  ) {}

  @Get('/trending')
  @ApiOperation({
    summary: '트렌드순 기획 리스트 조회',
    description:
      '트렌드순으로 정렬한 기획 리스트 조회(기획과 다르게 배포 초반에는 좋아요 수 기준 정렬 ㅓ리)',
  })
  async getTrendingProposals() {
    return this.proposalsService.getTrendingList();
  }

  @Get('/prefill')
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

  @Get('/:proposalId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '기획 상세 조회',
    description: '기획 상세 조회',
  })
  @ApiParam({
    name: 'proposalId',
    type: String,
    required: true,
    description: '기획 id',
  })
  async getProposal(@GetUserId() userId, @Param('proposalId') proposalId) {
    return this.proposalsService.getProposalById(userId, +proposalId);
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

  @Patch()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '기획 수정',
    description: '기획 수정',
  })
  @ApiBody({
    type: UpdateProposalDto,
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
  async updateEstate(
    @UploadedFiles()
    files: {
      thumbnail: Express.Multer.File;
      images?: Express.Multer.File[];
    },
    @GetUserId() userId,
    @Body() updateProposalDto: UpdateProposalDto,
  ) {
    const filenames = {
      thumbnail: files.thumbnail[0].filename,
      images: files.images
        ? files.images.map((file) => file.filename)
        : undefined,
    };
    return this.proposalsService.updateProposal(
      userId,
      filenames,
      updateProposalDto,
    );
  }

  @Delete()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '기획 삭제',
    description: '기획 id를 받아 토큰 검증 후 삭제',
  })
  @ApiQuery({
    name: 'proposalId',
    type: String,
    required: true,
    description: '기획 id',
  })
  async deleteProposal(@GetUserId() userId, @Query('proposalId') proposalId) {
    return this.proposalsService.deleteProposal(userId, +proposalId);
  }

  @Post('/like')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '기획 좋아요/취소',
    description: '기획 게시물 id를 받아 좋아요 추가 및 취소',
  })
  @ApiQuery({
    name: 'proposalId',
    type: String,
    required: true,
    description: '기획 id',
  })
  async proposalLikeUnlike(
    @Query('proposalId') proposalId,
    @GetUserId() userId,
  ) {
    return this.proposalsService.proposalLikeUnlike(proposalId, userId);
  }

  @Post('/opinion')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '의견 작성',
    description: '기획 게시물 id를 받아 의견 작성',
  })
  @ApiBody({
    description: '기획 등록 body',
    required: true,
    schema: {
      type: 'object',
      properties: {
        proposalId: { type: 'number' },
        opinionText: { type: 'string' },
      },
    },
  })
  async writeOpinion(@GetUserId() userId, @Body() body) {
    const { proposalId, opinionText } = body;
    return this.proposalsService.writeOpinion(userId, proposalId, opinionText);
  }
}
