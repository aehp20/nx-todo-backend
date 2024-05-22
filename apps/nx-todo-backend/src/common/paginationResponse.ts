import { IsArray } from 'class-validator';
import { PaginationMeta } from './paginationMeta';

export class PaginationResponse<T> {
  @IsArray()
  readonly data: T[];

  readonly meta: PaginationMeta;

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data;
    this.meta = meta;
  }
}
