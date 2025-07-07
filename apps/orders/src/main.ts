import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseValidationFilter } from './exceptions/mongoose.exception';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties that do not have any decorators
      transform: true, // Automatically transform payloads to DTO instances
    })
  )
  app.useGlobalFilters(new MongooseValidationFilter())
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') as number);
}
bootstrap()
  .then(() => Logger.log(`Ordering Server Run Successfully On Port 3000`))
  .catch((error) => Logger.error(`Error While bootstrap Ordering Server ${error}`))
