import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private typeorm: TypeOrmHealthIndicator,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health-check/http')
  @HealthCheck()
  async httpCheck() {
    return this.health.check([
      () => this.http.pingCheck('nestjs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get('/health-check/orm')
  @HealthCheck()
  async ormCheck() {
    return this.health.check([() => this.typeorm.pingCheck('database')]);
  }
}
