import { AutoMap } from '@automapper/classes';

export class TodoCreateDto {
  @AutoMap()
  name: string;

  @AutoMap()
  isDone: boolean;
}
