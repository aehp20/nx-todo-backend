import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('todos')
export class TodoEntity extends AbstractEntity {
  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  is_done: boolean;
}
