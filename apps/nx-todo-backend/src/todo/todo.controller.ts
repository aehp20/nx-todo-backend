import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationResponse } from '../common/paginationResponse';
import { TodoDto } from './todo.dto';
import { ITodoQuery, TodoQuery } from './todo.query';
import { TodoReadDto } from './todo.read.dto';
import { TodoService } from './todo.service';

@Controller({
  path: 'todo',
  version: '1',
})
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  create(@Body() todo: TodoDto): Promise<number> {
    return this.todoService.create(todo);
  }

  @Get()
  get(@Query() query: ITodoQuery): Promise<PaginationResponse<TodoReadDto>> {
    return this.todoService.find(new TodoQuery(query));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() todoDto: TodoDto) {
    return this.todoService.update(id, todoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.todoService.markAsDeleted(id);
  }
}
