import { ApiProperty } from '@nestjs/swagger';

export class KakaoTokensResDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '엑세스 토큰',
  })
  access_token: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '엑세스 토큰 유효시간',
  })
  expires_in: number;

  @ApiProperty({
    required: true,
    type: String,
    description: '리프레시 토큰',
  })
  refresh_token: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '리프레시 토큰 유효시간',
  })
  refresh_token_expires_in: number;
}
