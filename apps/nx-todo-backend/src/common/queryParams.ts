import { Order } from './order';

export interface IQueryParams {
  page?: number;
  pageSize?: number;
  order?: Order;
}

export class QueryParams implements IQueryParams {
  page?: number = 1;
  pageSize?: number = 5;
  order?: Order = Order.ASC;

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }
}
