import { IsString, IsInt, IsUrl } from 'class-validator';

export class CreateRepositoryDto {
  @IsString()
  name: string;

  @IsString()
  owner: string;

  @IsInt()
  stars: number;

  @IsUrl()
  url: string;
}
