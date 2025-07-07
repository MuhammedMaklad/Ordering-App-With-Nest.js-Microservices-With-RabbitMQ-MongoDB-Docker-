import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Response } from 'express';
import { CreateOrderRequest } from './dtos/createOrder.dto';

@Controller('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('create')
  async createOder(
    @Body() request: CreateOrderRequest,
    @Res() response: Response
  ) {
    const data = await this.ordersService.createNewOrder(request);
    return response.status(HttpStatus.CREATED).json({
      message: "Order Created Successfully",
      data
    })
  }
}
