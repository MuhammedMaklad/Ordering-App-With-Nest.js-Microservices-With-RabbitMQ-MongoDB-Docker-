import { DynamicModule, Module } from "@nestjs/common"; // Import NestJS decorators and types for dynamic modules
import { RmqService } from "./rmq.service"; // Import custom RMQ service
import { ConfigModule, ConfigService } from "@nestjs/config"; // Import config modules for environment variables
import { ClientsModule, Transport } from "@nestjs/microservices"; // Import microservices support

// Define options interface for registering the RMQ module
interface RmqModuleOptions {
  name: string; // The name of the microservice client
}

// Decorate the module and provide RmqService for dependency injection
@Module({
  imports: [ConfigModule], // Import ConfigModule to access environment variables
  providers: [RmqService], // Provide RmqService for use in other modules
  exports: [RmqService] // Export RmqService so it can be used elsewhere
})
export class RmqModule {
  // Static method to register the module dynamically with options
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule, // The module being registered
      imports: [
        // Register the microservice client asynchronously
        ClientsModule.registerAsync([
          {
            name, // The name of the client (used for injection)
            inject: [ConfigService], // Inject ConfigService for use in the factory
            imports: [ConfigModule], // Ensure ConfigModule is available
            useFactory: (configService: ConfigService) => {
              const url = configService.get<string>('RABBIT_MQ_URI'); // Get RabbitMQ URI from environment variables
              const queue = configService.get<string>(`RABBIT_MQ_${name}_QUEUE`); // Get queue name based on client name

              if (!url) {
                throw new Error(`Missing configuration for RABBIT_MQ_URI `);
              }
              if (!queue) {
                throw new Error(`Missing configuration for RABBIT_MQ_${name}_QUEUE`);
              }
              return {
                transport: Transport.RMQ, // Use RabbitMQ transport
                options: {
                  urls: [url], // RabbitMQ connection URI from env
                  queue: queue, // Queue name from env, based on client name
                  // queueOptions: {
                  //   durable: true, // Make the queue durable (survives broker restarts)
                  // }
                }
              }
            }
          }
        ])
      ],
      exports: [ClientsModule] // Export the ClientsModule so other modules can use the client
    }
  }
}