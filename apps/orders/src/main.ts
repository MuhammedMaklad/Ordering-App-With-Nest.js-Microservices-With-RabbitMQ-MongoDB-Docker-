import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap()
  .then(() => Logger.log(`Ordering Server Run Successfully On Port 3000`))
  .catch((error) => Logger.error(`Error While bootstrap Ordering Server ${error}`))
