import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import * as ip from 'ip';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>(`${process.env.NODE_ENV}.http.port`);
  const myIp = ip.address();

  app.enableCors({
    origin: ['*'],
    // credentials: true,
  });
  app.use(compression());
  app.setGlobalPrefix(configService.get<string>('prefix'));

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
    Logger.log(`Swagger Doc URL: http://${myIp}:${port}/api/doc`);
    Logger.log(
      '====================================================================',
    );
    Logger.log(`✅  FOLLOCA API Server running successfully!`);
  });
}
void bootstrap();
