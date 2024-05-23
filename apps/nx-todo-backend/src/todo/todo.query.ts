import { QueryParams } from '../common/queryParams';

export interface ITodoQuery extends QueryParams {
  name?: string;
  isDone?: string;
}

export class TodoQuery extends QueryParams implements ITodoQuery {
  name?: string;
  isDone?: string;

  constructor(model: Partial<TodoQuery> = {}) {
    super();

    this.name = model.name;
    this.isDone = model.isDone;

    this.page = model.page ? Number(model.page) : this.page;
    this.pageSize = model.pageSize ? Number(model.pageSize) : this.pageSize;
    this.order = model.order;
  }
}
