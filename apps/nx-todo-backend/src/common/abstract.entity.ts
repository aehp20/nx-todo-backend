import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column({ select: false })
  deleted_at: Date;

  @Column({ select: false })
  is_deleted: boolean;
}
