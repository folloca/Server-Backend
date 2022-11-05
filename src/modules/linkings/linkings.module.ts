import { Module } from '@nestjs/common';
import { LinkingsController } from './linkings.controller';
import { LinkingsService } from './linkings.service';

@Module({
  controllers: [LinkingsController],
  providers: [LinkingsService],
})
export class LinkingsModule {}
