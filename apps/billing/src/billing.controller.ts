import { Controller, Get, Logger } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common/rmq/rmq.service';

@Controller()
export class BillingController {
  private readonly logger: Logger = new Logger(BillingController.name, { timestamp: true });
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService
  ) { }

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.billingService.bill(data);
    this.rmqService.ack(context);
  }
}
