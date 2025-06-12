import { Injectable, Logger } from '@nestjs/common';
import { ImportRepositoryDto } from '../dtos/github-repository.dto';
import { parse } from 'papaparse';
import { Repository } from '../entity/repository.entity';
import { RepositoryService } from './repository.service';

@Injectable()
export class ImportCsvService {
  private readonly logger = new Logger(ImportCsvService.name);
  constructor(private readonly repositoryService: RepositoryService) {}

  private parseCsv(csvString: string): ImportRepositoryDto[] {
    const { data } = parse<ImportRepositoryDto>(csvString, { header: true });
    return data;
  }

  private validateRepos(
    data: ImportRepositoryDto[],
  ): Array<Partial<Repository>> {
    return data
      .filter((repo) => repo.name && repo.owner && repo.url)
      .map((repo) => ({
        name: repo.name,
        owner: repo.owner,
        stars: Number(repo.stars) || 0,
        url: repo.url,
      }));
  }

  async import(csvString: string): Promise<number> {
    const data = this.parseCsv(csvString);
    const validRepos = this.validateRepos(data);

    if (!validRepos.length) {
      this.logger.warn('Nenhum registro válido encontrado no CSV.');
      return 0;
    }

    try {
      await this.repositoryService.bulkInsert(validRepos);
      this.logger.log(
        `Bulk insert realizado com ${validRepos.length} registros.`,
      );
      return validRepos.length;
    } catch (error) {
      this.logger.error(
        'Erro ao importar registros do CSV',
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw error;
    }
  }
}
