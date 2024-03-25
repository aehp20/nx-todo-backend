import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("todos")
export class TodoEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  is_done: boolean;
}
