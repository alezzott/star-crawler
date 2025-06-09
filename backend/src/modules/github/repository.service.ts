import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from './repository.entity';
import { RepositoryRepository } from './repository.repository';
@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Repository)
    private readonly repositoryRepo: RepositoryRepository,
  ) {}

  async findAll(): Promise<Repository[]> {
    return this.repositoryRepo.findAll();
  }

  async create(data: Partial<Repository>): Promise<Repository> {
    return this.repositoryRepo.createAndSave(data);
  }
}
