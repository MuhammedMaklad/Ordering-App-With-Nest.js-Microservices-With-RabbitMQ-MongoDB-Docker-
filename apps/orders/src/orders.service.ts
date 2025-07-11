import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderRequest, CreateOrderResponse } from './dtos/createOrder.dto';
import { OrderRepository } from './order.repository';
import { GetOrderResponse } from './dtos/getOder.dto';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  private readonly logger: Logger = new Logger(OrdersService.name, { timestamp: true });
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) { }

  async createNewOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {

    const session = await this.orderRepository.startTransaction();
    try {
      const order = await this.orderRepository.create(orderData);
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request: orderData
        })
      )
      await session.commitTransaction()
      this.logger.log(`Order Created Successfully From Orders Service`);
      return new CreateOrderResponse(order);
    } catch (error) {
      await session.abortTransaction()
      throw new InternalServerErrorException("The Process of Creating Order is Failed" + error);
    }
    finally {
      await session.endSession()
    }
  }

  async getAllOrders(): Promise<GetOrderResponse[]> {
    const orders = await this.orderRepository.find({});
    return orders.map(order => new GetOrderResponse(order))
  }
}
