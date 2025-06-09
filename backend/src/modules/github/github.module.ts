import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubApiService } from './github.service';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';
import { RepositoryRepository } from './repository.repository';
import { Repository } from './repository.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Repository])],
  providers: [GithubApiService, RepositoryService, RepositoryRepository],
  controllers: [RepositoryController],
  exports: [GithubApiService],
})
export class GithubModule {}
