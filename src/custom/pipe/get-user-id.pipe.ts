import { Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GetUserIdPipe implements PipeTransform {
  constructor(private jwtService: JwtService) {}

  async transform(value: any) {
    if (!value.startsWith('Bearer')) {
      return 0;
    } else {
      const token = value.replace('Bearer', '').trim();
      const { userId } = await this.jwtService.verifyAsync(token);
      return userId;
    }
  }
}
