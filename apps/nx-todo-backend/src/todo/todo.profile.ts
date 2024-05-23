import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { TodoEntity } from './todo.entity';
import { TodoReadDto } from './todo.read.dto';

@Injectable()
export class TodoProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, TodoEntity, TodoReadDto);
    };
  }
}
