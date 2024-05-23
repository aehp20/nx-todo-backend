import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CamelCaseNamingConvention,
  SnakeCaseNamingConvention,
} from '@automapper/core';
import { TodoModule } from '../todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'nx-react-todo',
      entities: ['dist/**/*.entity.ts'],
      synchronize: false,
      autoLoadEntities: true,
      logging: true,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: {
        source: new SnakeCaseNamingConvention(),
        destination: new CamelCaseNamingConvention(),
      },
    }),
    TodoModule,
  ],
})
export class AppModule {}
