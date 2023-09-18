import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { EstatesModule } from './estates.module';
import { ProposalsModule } from './proposals.module';
import { LinkingsModule } from './linkings.module';
import { AdminModule } from './admin.module';
import { SearchesModule } from './searches.module';
import { TypeormConfigOptions } from '../config/typeorm.config';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import configuration from '../config/configuration';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('local', 'development', 'production')
          .default('local'),
      }),
    }),
    TypeOrmModule.forRootAsync(TypeormConfigOptions),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    TerminusModule,
    HttpModule,
    AuthModule,
    UsersModule,
    EstatesModule,
    ProposalsModule,
    LinkingsModule,
    AdminModule,
    SearchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
