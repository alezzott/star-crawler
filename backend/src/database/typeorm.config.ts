import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ImportJob } from 'src/modules/github/entity/import.entity';
import { Repository } from 'src/modules/github/entity/repository.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'starcrawler',
  entities: [Repository, ImportJob],
  synchronize: true,
};
