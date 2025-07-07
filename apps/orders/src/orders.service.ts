import { Injectable } from '@nestjs/common';
import { CreateOrderRequest, CreateOrderResponse } from './dtos/createOrder.dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository
  ) {

  }

  async createNewOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const order = await this.orderRepository.create(orderData);
    return new CreateOrderResponse(order);
  }
}
