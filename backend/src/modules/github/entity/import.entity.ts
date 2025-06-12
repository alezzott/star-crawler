import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('import_jobs')
export class ImportJob {
  @PrimaryColumn()
  jobId: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'done' | 'error';

  @Column({ nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
