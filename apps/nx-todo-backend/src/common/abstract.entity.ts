import { AutoMap } from '@automapper/classes';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column()
  created_at: Date;

  @AutoMap()
  @Column()
  updated_at: Date;

  @AutoMap()
  @Column({ select: false })
  deleted_at: Date;

  @AutoMap()
  @Column({ select: false })
  is_deleted: boolean;
}
