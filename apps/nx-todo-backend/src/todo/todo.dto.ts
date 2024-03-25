import { IsString, IsBoolean, IsNumber } from "class-validator";

export class TodoDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsBoolean()
  isDone: boolean;
}
