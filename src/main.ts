import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { promises } from 'fs';
import { join } from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import expressBasicAuth from 'express-basic-auth';
import helmet from 'helmet';
import * as ip from 'ip';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>(`${process.env.NODE_ENV}.http.port`);
  const prefix = configService.get<string>('prefix');
  const swaggerUser = configService.get<string>(
    `${process.env.NODE_ENV}.swagger.user`,
  );
  const swaggerPassword = configService.get<string>(
    `${process.env.NODE_ENV}.swagger.password`,
  );
  const myIp = ip.address();
  const pkg = JSON.parse(
    await promises.readFile(join('.', 'package.json'), 'utf8'),
  );

  app.enableShutdownHooks();
  app.setGlobalPrefix(prefix);

  app.use(compression());
  app.use(cookieParser());

  app.use(
    [`/${prefix}/doc`],
    expressBasicAuth({
      challenge: true,
      users: { [swaggerUser]: swaggerPassword },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FOLLOCA')
    .setDescription('Swagger document for FOLLOCA API server')
    .setVersion(pkg.version)
    .addCookieAuth(
      'auth-cookie',
      {
        type: 'http',
        in: 'cookie',
      },
      'refresh',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'Header' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${prefix}/doc`, app, document);

  app.use(helmet());

  await app.listen(port).finally(() => {
    Logger.log(
      '====================================================================',
    );
    Logger.log(`Node version: ${process.version}`);
    Logger.log(`Node env: ${process.env.NODE_ENV || 'local'}`);
    Logger.log(`CPU core: ${os.cpus().length}`);
    Logger.log(`User home: ${os.userInfo().username}`);
    Logger.log(`User home directory: ${os.userInfo().homedir}`);
    Logger.log(`Current IP: ${myIp}`);
    Logger.log(`Swagger Doc URL: http://${myIp}:${port}/${prefix}/doc`);
    Logger.log(
      '====================================================================',
    );
    Logger.log(`✅  FOLLOCA API Server running successfully!`);
  });
}
void bootstrap();
