import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('todos')
export class TodoEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  is_done: boolean;
}
