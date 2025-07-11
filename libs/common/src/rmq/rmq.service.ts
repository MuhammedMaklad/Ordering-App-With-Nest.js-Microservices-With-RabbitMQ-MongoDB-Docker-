import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";
import { Channel, Message } from "amqplib";
@Injectable()
export class RmqService {

  constructor(private readonly configService: ConfigService) { }

  /**
   * Returns the RMQ options for a given queue.
   * @param queue The name of the queue.
   * @param noAck Whether to acknowledge messages automatically.
   * @returns RmqOptions
   */
  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          this.configService.get<string>("RABBIT_MQ_URI") ?? (() => { throw new Error("RABBIT_MQ_URI is not defined"); })()
        ],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`) ?? (() => { throw new Error("RABBIT_MQ_QUEUe is not defined"); })(),
        noAck,
        persistent: true,
      }
    }
  }


  /**
   * Acknowledge a message in RabbitMQ
   * @param context - RabbitMQ context containing channel and message references
   */
  ack(context: RmqContext): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel: Channel = context.getChannelRef();
    const message: Message = context.getMessage();
    if (message) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      channel.ack(message);
    } else {
      throw new Error("Message is undefined, cannot acknowledge.");
    }
  }

}