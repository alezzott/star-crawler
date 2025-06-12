export interface GithubApiRepo {
  name: string;
  owner: { login: string };
  stargazers_count: number;
  html_url: string;
}

export class GithubRepositoryResponse {
  name: string;
  owner: string;
  stars: number;
  url: string;
}
