import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RmqService {

  constructor(private readonly configService: ConfigService) { }

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
}