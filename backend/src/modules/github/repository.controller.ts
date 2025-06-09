import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { Repository } from './repository.entity';
import { CreateRepositoryDto } from './dtos/create-repository.dto';
import { UpdateRepositoryDto } from './dtos/update-repository.dto';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('owner') owner?: string,
    @Query('stars') stars?: number,
  ): Promise<Repository[]> {
    return this.repositoryService.findAll({ name, owner, stars });
  }

  @Post()
  async create(@Body() data: CreateRepositoryDto): Promise<Repository> {
    return this.repositoryService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateRepositoryDto,
  ): Promise<Repository | null> {
    return this.repositoryService.update(id, data);
  }
}
