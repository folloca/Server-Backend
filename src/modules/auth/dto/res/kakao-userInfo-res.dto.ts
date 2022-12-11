import { ApiProperty } from '@nestjs/swagger';

export class KakaoUserInfosResDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'kakao_id',
  })
  target_id: number;

  @ApiProperty({
    type: String,
    description: '엑세스 토큰 유효시간',
  })
  properties: string[];
}
