import { Controller, Get } from '@nestjs/common';
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
}
