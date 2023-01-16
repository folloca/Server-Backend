import { Controller, Get, Patch, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
  ) {}

  @Get('/nickname/random')
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
    name: 'nickname',
    type: String,
    required: true,
    description: '새로운 닉네임',
  })
  async updateNickname(@Query() query) {
    const { userId, nickname } = query;
    return this.usersService.updateNickname(+userId, nickname);
  }

  @Get('nickname/check')
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
}
