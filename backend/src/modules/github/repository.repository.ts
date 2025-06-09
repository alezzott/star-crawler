import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from './repository.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RepositoryRepository {
  constructor(
    @InjectRepository(Repository)
    private readonly repo: TypeOrmRepository<Repository>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  createAndSave(data: Partial<Repository>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
