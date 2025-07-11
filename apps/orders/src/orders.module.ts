import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database/database.module';
import * as joi from 'joi'
import { OrderRepository } from './order.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { RmqModule } from '@app/common';
import { BILLING_SERVICE } from './constants/services';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        MONGODB_URI: joi.string().required(),
        PORT: joi.number().required()
      }),
      envFilePath: "./apps/orders/.env"
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema
      }
    ]),
    RmqModule.register({ name: BILLING_SERVICE })
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule { }
