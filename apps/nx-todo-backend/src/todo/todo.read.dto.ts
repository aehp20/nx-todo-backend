import { AutoMap } from '@automapper/classes';

export class TodoReadDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  isDone: boolean;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}
