import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ImportCsvService } from '../services/import-csv.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { ImportJob } from '../entity/import.entity';

@Controller()
export class ImportHandlerController {
  private readonly logger = new Logger(ImportHandlerController.name);
  constructor(
    private readonly importCsvService: ImportCsvService,
    @InjectRepository(ImportJob)
    private readonly importJobRepo: TypeOrmRepository<ImportJob>,
  ) {}

  @EventPattern('import_repositories')
  async handleImportRepositories(
    @Payload() payload: { csvString: string; jobId: string },
  ) {
    const { jobId, csvString } = payload;
    // Checa se o job já foi processado
    const existingJob = await this.importJobRepo.findOneBy({ jobId });
    if (existingJob && existingJob.status === 'done') {
      this.logger.warn(`Job ${jobId} já processado. Ignorando.`);
      return;
    }

    // Cria ou atualiza o status do job para processing
    await this.importJobRepo.save({
      jobId,
      status: 'processing',
    });
    this.logger.log(`Job ${jobId} status atualizado para [processing]`);

    try {
      this.logger.log(`Job recebido: ${jobId}`);
      const count = await this.importCsvService.import(csvString);
      await this.importJobRepo.save({
        jobId,
        status: 'done',
      });
      this.logger.log(`Job ${jobId} status atualizado para [done]`);
      return { jobId, status: 'done', count };
    } catch (error) {
      await this.importJobRepo.save({
        jobId,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      this.logger.error(
        `[ImportHandlerService] Erro ao importar job ${jobId}: ${error instanceof Error ? error.message : error}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
