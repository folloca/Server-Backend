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
        userId: { type: 'number' },
        password: { type: 'string' },
      },
    },
  })
  async checkPassword(@Body() body) {
    const { userId, password } = body;
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
    summary: 'profile 조회',
  })
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
    description:
      '조회하고자 하는 유저의 Email(테스트에따라 닉네임으로 변경될 수도..)',
  })
  async getProfile(@Query() query, @Res() res) {
    const email = query.email;

    if (email) {
      const userData = await this.usersService.getProfilePageUserInfo(email);
      const { userId } = userData;

      const proposals = await this.usersService.getProposalListByUserId(userId);
      const linkings = await this.usersService.getLinkingListByUserId(userId);
      const estates = await this.usersService.getEstateListByUserId(userId);

      if (userData) {
        res.status(200).send({
          profile: userData,
          dashboard: {
            post_cnt: proposals.length + linkings.length + estates.length,
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
        });
      } else {
        res.status(404).send({
          message: `Not Found User`,
        });
      }
    }
  }
}
