import { PipeTransform } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';

export class GetUserIdPipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  async transform(value: any) {
    const token = value.replace('Bearer', '').trim();
    const { userId } = await this.authService.validateAccessToken(token);
    return userId;
  }
}
