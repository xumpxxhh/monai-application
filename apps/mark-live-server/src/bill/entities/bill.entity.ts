import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('bill')
export class Bill {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  uid: number;

  @Column({ type: 'varchar', length: 10 })
  type: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  title: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'varchar', length: 64, default: '' })
  category: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  tags: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 1024, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'datetime' })
  time: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  remark: string | null;

  @Column({ name: 'is_deleted', type: 'tinyint', width: 1, default: 0 })
  isDeleted: number;
}
