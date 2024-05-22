import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Order } from '../common/order';
import { PageOptions } from '../common/paginationOptions';

export class TodoQuery extends PageOptions {
  @Type(() => String)
  @IsString()
  @IsOptional()
  name?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  isDone?: string;

  constructor(model: TodoQuery) {
    super(
      Number(model.page || 1),
      Number(model.pageSize || 5),
      model.order || Order.ASC
    );
    this.name = model.name;
    this.isDone = model.isDone;
  }
}
