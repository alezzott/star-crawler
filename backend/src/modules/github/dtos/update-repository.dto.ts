import { IsString, IsInt, IsOptional, IsUrl } from 'class-validator';

export class UpdateRepositoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsInt()
  stars?: number;

  @IsOptional()
  @IsUrl()
  url?: string;
}
