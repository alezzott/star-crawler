import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  GithubApiRepo,
  GithubRepositoryResponse,
} from '../interfaces/github-api-repo.interface';

@Injectable()
export class GithubApiService {
  private readonly logger = new Logger(GithubApiService.name);

  constructor(private readonly httpService: HttpService) {}

  async getUserRepositories(
    username: string,
  ): Promise<GithubRepositoryResponse[]> {
    const url = `https://api.github.com/users/${username}/repos`;
    this.logger.log(`Buscando repositórios do usuário: ${username}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<GithubApiRepo[]>(url),
      );
      this.logger.log(
        `Encontrados ${response.data.length} repositórios para ${username}`,
      );
      return response.data.map((repo) => this.mapDto(repo));
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao buscar repositórios do usuário ${username}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new Error('Erro ao buscar repositórios do GitHub');
    }
  }

  private mapDto(repo: GithubApiRepo): GithubRepositoryResponse {
    return {
      name: repo.name,
      owner: repo.owner.login,
      stars: repo.stargazers_count,
      url: repo.html_url,
    };
  }
}
