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
    summary: '닉네임 등록 또는 변경',
    description: '회원가입 시 닉네임 신규 등록 & 기존 닉네임 변경 시 모두 사용',
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
}
