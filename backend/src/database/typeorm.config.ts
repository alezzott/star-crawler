import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Repository } from 'src/modules/github/repository.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'starcrawler',
  entities: [Repository],
  synchronize: true,
};
