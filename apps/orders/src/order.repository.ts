import { AbstractRepository } from "@app/common/database/abstract.repository";
import { Order } from "./schema/order.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";



@Injectable()
export class OrderRepository extends AbstractRepository<Order> {
  protected readonly logger: Logger = new Logger(OrderRepository.name);

  constructor(
    @InjectModel(Order.name) orderModel: Model<Order>,
    @InjectConnection() connection: Connection
  ) {
    super(orderModel, connection)
  }
}