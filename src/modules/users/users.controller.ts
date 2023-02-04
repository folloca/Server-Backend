import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserinfoReqDto } from './dto/req/update-userinfo-req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../utilities/multer.options';

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
  @ApiOperation({
    summary: '닉네임 변경',
    description: '기존에 등록된 닉네임 변경 및 데이터 저장 시 중복 검사 수행',
  })
  @ApiQuery({
    name: 'userId',
    type: String,
    required: true,
    description: '사용자 인덱스',
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
  async updateNickname(@Query() query) {
    const { userId, newName, oldName } = query;
    return this.usersService.updateNickname(+userId, newName, oldName);
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
  @ApiOperation({
    summary: '회원정보 수정 페이지 데이터',
    description: '회원정보 수정 페이지 접속 시 기존 데이터',
  })
  @ApiQuery({
    name: 'userId',
    type: String,
    required: true,
    description: '사용자 인덱스',
  })
  async getEditPageUserInfo(@Query('userId') userId) {
    return this.usersService.getEditPageUserInfo(+userId);
  }

  @Post('/password/check')
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

  @Post('edit')
  @ApiOperation({
    summary: '회원정보 수정',
    description: '회원정보 수정',
  })
  @ApiQuery({
    name: 'userId',
    type: String,
    required: true,
    description: '사용자 id',
  })
  @ApiBody({
    type: UpdateUserinfoReqDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImage', multerOptions('profile')))
  async updateUserInfo(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserinfoReqDto: UpdateUserinfoReqDto,
  ) {
    return await this.usersService.updateUserInfo(updateUserinfoReqDto);
  }
}
