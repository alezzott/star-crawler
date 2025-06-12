import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { GithubModule } from './modules/github/github.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), GithubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
