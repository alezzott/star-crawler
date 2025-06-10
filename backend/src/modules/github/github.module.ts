import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubApiService } from './services/github.service';
import { RepositoryController } from './controllers/repository.controller';
import { RepositoryRepository } from './repository.repository';
import { Repository } from './entity/repository.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQService } from './services/rabbitmq.service';
import { ImportHandlerController } from './controllers/import-handler.controller';
import { ImportCsvService } from './services/import-csv.service';
import { RepositoryService } from './services/repository.service';
import { ImportJob } from './entity/import.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Repository, ImportJob])],
  controllers: [RepositoryController, ImportHandlerController],
  providers: [
    GithubApiService,
    RepositoryService,
    RepositoryRepository,
    ImportCsvService,
    RabbitMQService,
  ],
  exports: [GithubApiService, RepositoryService],
})
export class GithubModule {}
