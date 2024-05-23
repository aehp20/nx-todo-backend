import { Mapper, createMap, forMember, ignore } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { TodoCreateDto } from './todo.create.dto';
import { TodoEntity } from './todo.entity';
import { TodoReadDto } from './todo.read.dto';
import { TodoUpdateDto } from './todo.update.dto';

@Injectable()
export class TodoProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, TodoEntity, TodoReadDto);
      createMap(
        mapper,
        TodoCreateDto,
        TodoEntity,
        forMember((dest) => dest.id, ignore())
      );
      createMap(mapper, TodoUpdateDto, TodoEntity);
    };
  }
}
