import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Repository } from '../entity/repository.entity';
import { GithubApiService } from '../services/github.service';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RabbitMQService } from '../services/rabbitmq.service';
import { RepositoryService } from '../services/repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ImportJob } from '../entity/import.entity';
import { Repository as TypeOrmRepository } from 'typeorm';

@Controller('repositories')
export class RepositoryController {
  private readonly logger = new Logger(RepositoryController.name);

  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly githubApiService: GithubApiService,
    private readonly rabbitMQService: RabbitMQService,
    @InjectRepository(ImportJob)
    private readonly importJobRepo: TypeOrmRepository<ImportJob>,
  ) {}

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('owner') owner?: string,
    @Query('stars') stars?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<{
    data: Repository[];
    total: number;
    page: number;
    limit: number;
  }> {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 20;

    return this.repositoryService.findAllPaginated({
      name,
      owner,
      stars,
      page: pageNumber,
      limit: limitNumber,
    });
  }

  @Get('export/csv')
  async exportCsv(
    @Res() res: Response,
    @Query('name') name?: string,
    @Query('owner') owner?: string,
    @Query('stars') stars?: number,
  ): Promise<void> {
    const csv = await this.repositoryService.exportToCsv({
      name,
      owner,
      stars,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="repositories.csv"',
    );
    res.send(csv);
  }

  @Get('/github/:username')
  async getGithubRepos(@Param('username') username: string) {
    return this.githubApiService.getUserRepositories(username);
  }

  @Get('import/status/:jobId')
  async getImportStatus(@Param('jobId') jobId: string) {
    try {
      const job = await this.importJobRepo.findOneBy({ jobId });
      if (!job) {
        this.logger.warn(`[IMPORT STATUS] Job não encontrado: ${jobId}`);
        throw new NotFoundException(`Job ${jobId} não encontrado`);
      }
      return {
        jobId: job.jobId,
        status: job.status,
        errorMessage: job.errorMessage,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      };
    } catch (error) {
      this.logger.error(
        `[IMPORT STATUS] Erro ao consultar status do job ${jobId}: ${error instanceof Error ? error.message : error}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  @Post('import/csv')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    try {
      this.logger.log(
        `[IMPORT CSV] Arquivo recebido: ${file.originalname} | Tamanho: ${file.size}`,
      );
      const csvString = file.buffer.toString('utf-8');
      this.logger.log(
        `[IMPORT CSV] Primeiros 200 caracteres do CSV: ${csvString.slice(0, 200)}`,
      );
      const jobId = uuidv4();
      this.logger.log(`[IMPORT CSV] JobId gerado: ${jobId}`);
      await this.rabbitMQService.sendImportJob(csvString, jobId);
      this.logger.log(`[IMPORT CSV] Job enviado para fila RabbitMQ`);
      return { status: 'processing', jobId };
    } catch (error) {
      this.logger.error(
        `[IMPORT CSV] Erro ao importar arquivo: ${error instanceof Error ? error.message : error}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
