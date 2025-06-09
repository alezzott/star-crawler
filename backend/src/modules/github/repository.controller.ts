import { Controller, Get, Post, Body } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { Repository } from './repository.entity';
import { CreateRepositoryDto } from './dtos/create-repository.dto';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get()
  async findAll(): Promise<Repository[]> {
    return this.repositoryService.findAll();
  }

  @Post()
  async create(@Body() data: CreateRepositoryDto): Promise<Repository> {
    return this.repositoryService.create(data);
  }
}
