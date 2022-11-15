import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EstatesModule } from './modules/estates/estates.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { LinkingsModule } from './modules/linkings/linkings.module';
import { AdminModule } from './modules/admin/admin.module';
import { SearchesModule } from './modules/searches/searches.module';
import { TypeormConfigOptions } from './config/typeorm.config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import configuration from './config/configuration';
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
