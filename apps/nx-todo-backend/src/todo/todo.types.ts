import { TodoDto } from './todo.dto';

export type TodoResponse = {
  items: TodoDto[];
  allCount: number;
  filteredCount: number;
};
