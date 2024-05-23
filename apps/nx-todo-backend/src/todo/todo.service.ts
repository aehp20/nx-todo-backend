import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PaginationMeta } from '../common/paginationMeta';
import { PaginationResponse } from '../common/paginationResponse';
import { TodoDto } from './todo.dto';
import { TodoEntity } from './todo.entity';
import { TodoQuery } from './todo.query';
import { TodoReadDto } from './todo.read.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @InjectMapper() private readonly classMapper: Mapper
  ) {}

  async create(todo: TodoDto): Promise<number> {
    try {
      const todoEntity = new TodoEntity();

      todoEntity.name = todo.name;
      todoEntity.is_done = todo.isDone;

      const createdTodoEntity = await this.todoRepository.save(todoEntity);

      return new Promise(function (resolve, _reject) {
        setTimeout(function () {
          resolve(createdTodoEntity.id);
        }, 3000);
      });

      // return createdTodoEntity.id;
    } catch (ex) {
      throw new Error(`create error: ${ex.message}.`);
    }
  }

  async find(todoQuery: TodoQuery): Promise<PaginationResponse<TodoReadDto>> {
    try {
      const queryBuilder = this.todoRepository.createQueryBuilder('todo');

      queryBuilder
        .orderBy('todo.created_at', todoQuery.order)
        .where('todo.is_deleted = :is_deleted', { is_deleted: false })
        .andWhere(
          new Brackets((qb) => {
            if (typeof todoQuery.name === 'string') {
              qb.where('LOWER(todo.name) like LOWER(:name)', {
                name: `%${todoQuery.name}%`,
              });
            } else {
              qb.where('todo.name is not null');
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (typeof todoQuery.isDone === 'string') {
              qb.where('todo.is_done = :is_done', {
                is_done: todoQuery.isDone === 'true',
              });
            } else {
              qb.where('todo.is_done is not null');
            }
          })
        )
        .skip(todoQuery.skip)
        .take(todoQuery.pageSize);

      const totalItems = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const paginationMeta = new PaginationMeta(
        todoQuery.page,
        todoQuery.pageSize,
        totalItems
      );
      const todosReadDto = this.classMapper.mapArray(
        entities,
        TodoEntity,
        TodoReadDto
      );
      const paginationResponse = new PaginationResponse<TodoReadDto>(
        todosReadDto,
        paginationMeta
      );

      return new Promise(function (resolve, _reject) {
        setTimeout(function () {
          resolve(paginationResponse);
        }, 0); // 3000
      });

      // return paginationResponse;
    } catch (ex) {
      throw new Error(`findAll error: ${ex.message}.`);
    }
  }

  async findOne(id: number): Promise<TodoReadDto | undefined> {
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

      const todoReadDto = this.classMapper.map(
        todoFromDB,
        TodoEntity,
        TodoReadDto
      );

      return new Promise(function (resolve, _reject) {
        setTimeout(function () {
          resolve(todoReadDto);
        }, 0); // 3000
      });
      // return todoReadDto;
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

      return new Promise(function (resolve, _reject) {
        setTimeout(function () {
          resolve(affected);
        }, 3000);
      });

      // return affected;
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

      return new Promise(function (resolve, _reject) {
        setTimeout(function () {
          resolve(affected);
        }, 3000);
      });

      // return affected;
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
