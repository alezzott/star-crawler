import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from './repository.entity';
import { RepositoryRepository } from './repository.repository';
import { UpdateRepositoryDto } from './dtos/update-repository.dto';
@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Repository)
    private readonly repositoryRepo: RepositoryRepository,
  ) {}

  async findAll(filters?: {
    name?: string;
    owner?: string;
    stars?: number;
  }): Promise<Repository[]> {
    const where: Partial<Repository> = {};
    if (filters?.name) where.name = filters.name;
    if (filters?.owner) where.owner = filters.owner;
    if (filters?.stars) where.stars = filters.stars;
    return this.repositoryRepo.findAll(where);
  }

  async create(data: Partial<Repository>): Promise<Repository> {
    return this.repositoryRepo.createAndSave(data);
  }

  async update(
    id: number,
    data: UpdateRepositoryDto,
  ): Promise<Repository | null> {
    await this.repositoryRepo.update(id, data);
    return this.repositoryRepo.findOneBy({ id });
  }
}
