import { Injectable } from '@nestjs/common';
import { TodoDto } from './todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(TodoEntity) private readonly todoRepository: Repository<TodoEntity>) { }

  async create(todo: TodoDto): Promise<number> {
    try {
      const todoEntity = new TodoEntity();

      todoEntity.name = todo.name;
      todoEntity.is_done = todo.isDone;

      const createdTodoEntity = await this.todoRepository.save(todoEntity);

      return createdTodoEntity.id;
    }
    catch (ex) {
      throw new Error(`create error: ${ex.message}.`);
    }
  }

  async find(): Promise<TodoDto[]> {
    try {
      const todos = await this.todoRepository.find();

      return todos.map(todoEntity => ({id: todoEntity.id, name: todoEntity.name, isDone: todoEntity.is_done})); // TodoDto.fromEntity(todoEntity)
    }
    catch (ex) {
      throw new Error(`findAll error: ${ex.message}.`);
    }
  }

  async findOne(
    id: number
  ): Promise<TodoDto | undefined> {
    if (!id) {
      throw new Error(`findOne error: id is empty.`);
    }
    try {
      const todoFromDB = await this.todoRepository.findOne({
        where: {
          id: id
        }
      });
      if (!todoFromDB) {
        throw new Error(`Error during findOne, item not found => id: ${id}}`);
      }
      const todoDto = {id: todoFromDB.id, name: todoFromDB.name, isDone: todoFromDB.is_done};

      return todoDto;
    }
    catch (ex) {
      throw new Error(`findOne error: ${ex.message}.`);
    }
  }

  async update(
    id: number,
    todo: TodoDto,
  ): Promise<number | undefined> {
    if (!id) {
      throw new Error(`update error: id is empty.`);
    }
    try {
      const todoEntity = new TodoEntity();

      todoEntity.name = todo.name;
      todoEntity.is_done = todo.isDone;

      const { affected } = await this.todoRepository.update(id, todoEntity);

      return affected;
    }
    catch (ex) {
      throw new Error(`Update error: ${ex.message}.`);
    }
  }

  async remove(
    id: number
  ): Promise<number> {
    if (!id) {
      throw new Error(`update error: id is empty.`);
    }
    try {
      const todoFromDB = await this.todoRepository.findOne({
        where: {
          id: id
        }
      });
      if (!todoFromDB) {
        throw new Error(`Error during remove, item not found => id: ${id}}`);
      }
      const deletedRows = await this.todoRepository.remove([todoFromDB]);

      return deletedRows.length;
    }
    catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }
}
