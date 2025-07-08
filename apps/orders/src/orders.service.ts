import { Injectable } from '@nestjs/common';
import { CreateOrderRequest, CreateOrderResponse } from './dtos/createOrder.dto';
import { OrderRepository } from './order.repository';
import { GetOrderResponse } from './dtos/getOder.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository
  ) { }

  async createNewOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const order = await this.orderRepository.create(orderData);
    return new CreateOrderResponse(order);
  }

  async getAllOrders(): Promise<GetOrderResponse[]> {
    const orders = await this.orderRepository.find({});
    return orders.map(order => new GetOrderResponse(order))
  }
}
