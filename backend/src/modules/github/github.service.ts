import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GithubRepositoryResponseDto } from './dtos/github-repository.dto';

interface GithubApiRepo {
  name: string;
  owner: { login: string };
  stargazers_count: number;
  html_url: string;
}

@Injectable()
export class GithubApiService {
  constructor(private readonly httpService: HttpService) {}

  async getUserRepositories(
    username: string,
  ): Promise<GithubRepositoryResponseDto[]> {
    const url = `https://api.github.com/users/${username}/repos`;
    const response = await firstValueFrom(
      this.httpService.get<GithubApiRepo[]>(url),
    );
    return response.data.map((repo) => ({
      name: repo.name,
      owner: repo.owner.login,
      stars: repo.stargazers_count,
      url: repo.html_url,
    }));
  }
}
