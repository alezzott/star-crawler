import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { getRabbitMQConfig } from 'src/database/rabbitmq.config';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private client: ClientProxy;

  onModuleInit() {
    this.logger.log('Inicializando RabbitMQ ClientProxy...');
    const { url, queue } = getRabbitMQConfig();
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue,
        queueOptions: { durable: true },
      },
    });
    this.logger.log('ClientProxy criado');
  }

  async sendImportJob(csvString: string, jobId: string) {
    this.logger.log(`Emitindo evento: import_repositories | jobId: ${jobId}`);

    try {
      await firstValueFrom(
        this.client.emit('import_repositories', { csvString, jobId }),
      );
      this.logger.log(`Job enviado para fila: jobId: ${jobId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao enviar job para fila: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          'Erro ao enviar job para fila: Erro desconhecido',
          JSON.stringify(error),
        );
      }
    }
  }
}
