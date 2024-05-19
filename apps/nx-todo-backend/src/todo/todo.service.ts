import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TodoDto } from './todo.dto';
import { TodoEntity } from './todo.entity';
import { TodoQuery } from './todo.query';
import { TodoResponse } from './todo.types';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>
  ) {}

  async create(todo: TodoDto): Promise<number> {
    try {
      const todoEntity = new TodoEntity();

      todoEntity.name = todo.name;
      todoEntity.is_done = todo.isDone;

      const createdTodoEntity = await this.todoRepository.save(todoEntity);

      return createdTodoEntity.id;
    } catch (ex) {
      throw new Error(`create error: ${ex.message}.`);
    }
  }

  async find(todoQuery: TodoQuery): Promise<TodoResponse> {
    try {
      let filters = {};
      if (typeof todoQuery.name === 'string') {
        filters = { name: ILike(`%${todoQuery.name}%`) };
      }
      if (typeof todoQuery.isDone === 'string') {
        filters = { is_done: todoQuery.isDone === 'true' };
      }
      const allCount = await this.todoRepository.count({
        where: {
          is_deleted: false,
        },
      });
      const [todos, filteredCount] = await this.todoRepository.findAndCount({
        where: {
          is_deleted: false,
          ...filters,
        },
      });

      return {
        items: todos.map((todoEntity) => ({
          id: todoEntity.id,
          name: todoEntity.name,
          isDone: todoEntity.is_done,
          createdAt: todoEntity.created_at,
          updatedAt: todoEntity.updated_at,
        })),
        allCount,
        filteredCount,
      };
    } catch (ex) {
      throw new Error(`findAll error: ${ex.message}.`);
    }
  }

  async findOne(id: number): Promise<TodoDto | undefined> {
    if (!id) {
      throw new Error(`findOne error: id is empty.`);
    }
    try {
      const todoFromDB = await this.todoRepository.findOne({
        where: {
          id: id,
          is_deleted: false,
        },
      });
      if (!todoFromDB) {
        throw new Error(`Error during findOne, item not found => id: ${id}}`);
      }
      const todoDto = {
        id: todoFromDB.id,
        name: todoFromDB.name,
        isDone: todoFromDB.is_done,
        createdAt: todoFromDB.created_at,
        updatedAt: todoFromDB.updated_at,
      };

      return todoDto;
    } catch (ex) {
      throw new Error(`findOne error: ${ex.message}.`);
    }
  }

  async update(id: number, todo: TodoDto): Promise<number | undefined> {
    if (!id) {
      throw new Error(`update error: id is empty.`);
    }
    try {
      const todoFromDB = await this.todoRepository.findOne({
        where: {
          id: id,
          is_deleted: false,
        },
      });
      if (!todoFromDB) {
        throw new Error(`Error during update, item not found => id: ${id}}`);
      }
      const todoEntity = new TodoEntity();

      todoEntity.name = todo.name;
      todoEntity.is_done = todo.isDone;
      todoEntity.updated_at = new Date();

      const { affected } = await this.todoRepository.update(id, todoEntity);

      return affected;
    } catch (ex) {
      throw new Error(`update error: ${ex.message}.`);
    }
  }

  async markAsDeleted(id: number): Promise<number> {
    if (!id) {
      throw new Error(`mark as deleted error: id is empty.`);
    }
    try {
      const todoFromDB = await this.todoRepository.findOne({
        where: {
          id: id,
          is_deleted: false,
        },
      });
      if (!todoFromDB) {
        throw new Error(
          `Error during mark as deleted, item not found => id: ${id}}`
        );
      }
      const todoEntity = new TodoEntity();

      todoEntity.is_deleted = true;
      todoEntity.deleted_at = new Date();

      const { affected } = await this.todoRepository.update(id, todoEntity);

      return affected;
    } catch (ex) {
      throw new Error(`mark as deleted error: ${ex.message}.`);
    }
  }

  async remove(id: number): Promise<number> {
    if (!id) {
      throw new Error(`update error: id is empty.`);
    }
    try {
      const todoFromDB = await this.todoRepository.findOne({
        where: {
          id: id,
          is_deleted: false,
        },
      });
      if (!todoFromDB) {
        throw new Error(`Error during remove, item not found => id: ${id}}`);
      }
      const deletedRows = await this.todoRepository.remove([todoFromDB]);

      return deletedRows.length;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }
}
