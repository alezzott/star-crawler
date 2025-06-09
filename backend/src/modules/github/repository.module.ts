import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from './repository.entity';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Repository])],
  controllers: [RepositoryController],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class GithubModule {}
