import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async kakaoCheck(kakao_id: string) {
    const accountInfo = await this.userRepository.findAccountByKakaoId(
      kakao_id,
    );

    if (accountInfo) return accountInfo;
    else return false;
  }
}
