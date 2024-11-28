import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class GeneralEntity {
  @PrimaryColumn({ generated: true, generatedType: 'STORED' })
  id: number;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
