import { PipeTransform } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { UserRepository } from '../../repositories/user.repository';

export class GetUserIdPipe implements PipeTransform {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  async transform(value: any) {
    const token = value.replace('Bearer', '').trim();
  }
}
