import { Injectable, Logger } from '@nestjs/common';
import { unparse as jsonToCsv } from 'papaparse';
import { RepositoryRepository } from '../repository.repository';
import { Repository } from '../entity/repository.entity';

@Injectable()
export class RepositoryService {
  private readonly logger = new Logger(RepositoryService.name);
  constructor(private readonly repositoryRepo: RepositoryRepository) {}

  async findAll(filters?: {
    name?: string;
    owner?: string;
    stars?: number;
  }): Promise<Repository[]> {
    const where: Partial<Repository> = this.buildWhere(filters);
    return this.repositoryRepo.findAll(where);
  }

  async findAllPaginated(filters: {
    name?: string;
    owner?: string;
    stars?: number;
    page: number;
    limit: number;
  }): Promise<{
    data: Repository[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, ...where } = filters;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repositoryRepo.findAndCount({
      where: this.buildWhere(where),
      skip,
      take: limit,
    });
    this.logger.log(`[findAll] Filtros aplicados: ${JSON.stringify(where)}`);

    return { data, total, page, limit };
  }

  async bulkInsert(repos: Array<Partial<Repository>>): Promise<void> {
    this.logger.log(`[bulkInsert] Inserindo ${repos.length} repositórios`);
    await this.repositoryRepo.saveMany(repos);
  }

  exportToCsv(
    repositories: Array<{
      name: string;
      owner: string;
      stars: number;
      url: string;
    }>,
  ): string {
    this.logger.log(`[exportToCsv] Exportando repositórios recebidos para CSV`);
    const data = repositories.map((repo) => ({
      name: repo.name,
      owner: repo.owner,
      stars: repo.stars,
      url: repo.url,
    }));
    return jsonToCsv(data, { header: true });
  }

  private buildWhere(filters?: {
    name?: string;
    owner?: string;
    stars?: number;
  }): Partial<Repository> {
    const where: Partial<Repository> = {};
    if (filters?.name) where.name = filters.name;
    if (filters?.owner) where.owner = filters.owner;
    if (filters?.stars) where.stars = filters.stars;
    return where;
  }
}
