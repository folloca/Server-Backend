import { ApiProperty } from '@nestjs/swagger';

export class KakaoUserInfosResDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'kakao_id',
  })
  id: number;

  @ApiProperty({
    type: Object,
    description: 'kakao_account_info',
  })
  kakao_account: {
    email: string | null;
    profile: {
      is_default_image: boolean;
      profile_image_url: string | null;
    };
  };
}
