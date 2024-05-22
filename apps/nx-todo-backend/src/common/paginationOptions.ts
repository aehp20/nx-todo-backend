import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from './order';

export class PageOptions {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly pageSize?: number = 5;

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }

  constructor(page: number, pageSize: number, order: Order) {
    this.page = page;
    this.pageSize = pageSize;
    this.order = order;
  }
}
