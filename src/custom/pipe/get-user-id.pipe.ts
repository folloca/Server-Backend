import { Injectable, PipeTransform } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class GetUserIdPipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  async transform(value: any) {
    const token = value.replace('Bearer', '').trim();
    const { userId } = await this.authService.validateAccessToken(token);
    return userId;
  }
}
