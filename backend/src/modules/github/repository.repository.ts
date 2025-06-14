import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from './entity/repository.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RepositoryRepository {
  constructor(
    @InjectRepository(Repository)
    private readonly repo: TypeOrmRepository<Repository>,
  ) {}

  async findAll(where: Partial<Repository> = {}) {
    return this.repo.find({ where });
  }

  createAndSave(data: Partial<Repository>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Repository>) {
    return this.repo.update(id, data);
  }

  async findOneBy(where: Partial<Repository>) {
    return this.repo.findOneBy(where);
  }

  async saveMany(entities: Partial<Repository>[]) {
    return this.repo.save(entities);
  }

  async findAndCount(options: {
    where?: Partial<Repository>;
    skip?: number;
    take?: number;
  }) {
    return this.repo.findAndCount(options);
  }
}
