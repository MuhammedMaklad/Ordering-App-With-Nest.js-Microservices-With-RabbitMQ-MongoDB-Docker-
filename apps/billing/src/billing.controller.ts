import { Controller, Get, Logger } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class BillingController {
  private readonly logger: Logger = new Logger(BillingController.name, { timestamp: true });
  constructor(private readonly billingService: BillingService) { }

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`Received order_created event with data: ${JSON.stringify(data)}`);
    this.billingService.bill(data);
  }
}
