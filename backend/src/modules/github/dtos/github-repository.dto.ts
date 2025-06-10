import { IsString, IsInt, IsUrl, IsOptional } from 'class-validator';

export class ImportRepositoryDto {
  @IsString()
  name: string;

  @IsString()
  owner: string;

  @IsInt()
  @IsOptional()
  stars: number;

  @IsUrl()
  url: string;
}
