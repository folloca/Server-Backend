import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../services/users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserinfoReqDto } from '../dto/req/update-userinfo-req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../utilities/multer.options';
import { GetUserId } from '../custom/decorator/user-id.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
  ) {}

  @Get('/nickname')
  @ApiOperation({
    summary: '닉네임 랜덤 추천',
    description: '아직 등록되지 않은 닉네임 조합으로 추천',
  })
  async getRandomNickname() {
    return this.usersService.getRandomNickname();
  }

  @Patch('/nickname')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '닉네임 변경',
    description: '기존에 등록된 닉네임 변경 및 데이터 저장 시 중복 검사 수행',
  })
  @ApiQuery({
    name: 'newName',
    type: String,
    required: true,
    description: '새로운 닉네임',
  })
  @ApiQuery({
    name: 'oldName',
    type: String,
    required: true,
    description: '이전 닉네임',
  })
  async updateNickname(@Query() query, @GetUserId() userId) {
    const { newName, oldName } = query;
    return this.usersService.updateNickname(userId, newName, oldName);
  }

  @Get('/nickname/check')
  @ApiOperation({
    summary: '닉네임 중복 검사',
    description: '닉네임 데이터 중복 검사',
  })
  @ApiQuery({
    name: 'nickname',
    type: String,
    required: true,
    description: '검사하고자 하는 닉네임',
  })
  async checkNickname(@Query() query) {
    return this.usersService.checkNickname(query.nickname);
  }

  @Get('/edit')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원정보 수정 페이지 데이터',
    description: '회원정보 수정 페이지 접속 시 기존 데이터',
  })
  async getEditPageUserInfo(@GetUserId() userId) {
    return this.usersService.getEditPageUserInfo(userId);
  }

  @Post('/password/check')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '현재 비밀번호 확인',
  })
  @ApiBody({
    schema: {
      properties: {
        password: { type: 'string' },
      },
    },
  })
  async checkPassword(@GetUserId() userId, @Body() body) {
    const { password } = body;
    return await this.usersService.checkPassword(userId, password);
  }

  @Patch('edit')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원정보 수정',
    description: '회원정보 수정',
  })
  @ApiBody({
    type: UpdateUserinfoReqDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImage', multerOptions('profile')))
  async updateUserInfo(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserinfoReqDto: UpdateUserinfoReqDto,
    @GetUserId() userId,
  ) {
    return await this.usersService.updateUserInfo(userId, updateUserinfoReqDto);
  }

  @Get('/profile')
  @ApiOperation({
    summary: 'profile dashboard & 작성한 글 조회',
  })
  @ApiParam({
    name: 'user_id',
    type: String,
    required: true,
    description: '조회하고자 하는 유저의 인덱스 값',
  })
  async getProfileDashboard(
    @GetUserId() currentUserId,
    @Query() query,
    @Res() res,
  ) {
    const userId = +query.userId;

    if (userId) {
      const userData = await this.usersService.getUserData(userId);

      if (userData) {
        const proposals = await this.usersService.getProposalListByUserId(
          userId,
        );
        const linkings = await this.usersService.getLinkingListByUserId(userId);
        const estates = await this.usersService.getEstateListByUserId(userId);
        const returnData = {
          profile: userData,
          dashboard: {
            post_cnt:
              Object.keys(proposals).length + linkings.length + estates.length,
            likes_cnt: (await this.usersService.getLikedPostByUserId(userId))
              .total_cnt,
            sentOpinion_cnt: (
              await this.usersService.getSentOpinionByUserId(userId)
            ).total_cnt,
            recentPosts_cnt: (await this.usersService.getLatestSeen(userId))
              .total_cnt,
          },
          posts: {
            proposals: proposals,
            linkings: linkings,
            estates: estates,
          },
        };

        if (currentUserId !== userId) {
          delete returnData.dashboard;
        }

        res.status(200).send(returnData);
      } else {
        res.status(404).send({
          message: `Not Found User`,
        });
      }
    }
  }

  @Get('/profile/likes')
  @ApiOperation({
    summary: 'profile like 조회',
  })
  @ApiParam({
    name: 'user_id',
    type: String,
    required: true,
    description: '조회하고자 하는 유저의 인덱스 값',
  })
  async getProfileLikes(@Query() query, @Res() res) {
    const userId = +query.userId;

    const userData = await this.usersService.getProfilePageUserInfo(userId);

    if (userData) {
      const likeList = await this.usersService.getLikedPostByUserId(userId);

      const proposalIds = likeList.posts.proposals.map(
        (proposal) => proposal.proposalId,
      );
      const linkingIds = likeList.posts.linkings.map(
        (linking) => linking.linkingId.linkingId,
      );
      const estateIds = likeList.posts.estates.map((estate) => estate.estateId);

      res.status(200).send({
        total_cnt: likeList.total_cnt,
        posts: await this.usersService.getLikesPostByIds(
          proposalIds,
          linkingIds,
          estateIds,
        ),
      });
    } else {
      res.status(404).send({
        message: `Not Found User`,
      });
    }
  }

  @Get('/profile/opinions')
  @ApiOperation({
    summary: 'profile 보낸 의견 조회',
  })
  @ApiParam({
    name: 'user_id',
    type: String,
    required: true,
    description: '조회하고자 하는 유저의 인덱스 값',
  })
  async getProfileOpinions(@Query() query, @Res() res) {
    const userId = +query.userId;

    if (userId) {
      const userData = await this.usersService.getProfilePageUserInfo(userId);

      if (userData) {
        const opinionList = await this.usersService.getSentOpinionByUserId(
          userId,
        );

        res.status(200).send({
          total_cnt: opinionList.total_cnt,
          posts: opinionList.posts,
        });
      } else {
        res.status(404).send({
          message: `Not Found User`,
        });
      }
    }
  }

  @Get('/profile/recent')
  @ApiOperation({
    summary: 'profile 보낸 의견 조회',
  })
  @ApiParam({
    name: 'user_id',
    type: String,
    required: true,
    description: '조회하고자 하는 유저의 인덱스 값',
  })
  async getProfileRecent(@Query() query, @Res() res) {
    const userId = +query.userId;

    if (userId) {
      const userData = await this.usersService.getProfilePageUserInfo(userId);

      if (userData) {
        const recentIdList = await this.usersService.getLatestSeen(userId);

        const recentPostList = await this.usersService.getLatestSeenPosts(
          recentIdList.posts,
        );

        res.status(200).send({
          total_cnt: recentIdList.total_cnt,
          posts: recentPostList,
        });
      } else {
        res.status(404).send({
          message: `Not Found User`,
        });
      }
    }
  }
}
