import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { RmqService } from '@app/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions("BILLING"))
  await app.startAllMicroservices()
  Logger.log('Billing app running with microservice');
}
bootstrap()
  .catch(error => Logger.error(error));
