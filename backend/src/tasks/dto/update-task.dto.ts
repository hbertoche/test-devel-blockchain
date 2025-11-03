import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    description: 'Status de conclusão da tarefa',
    example: true
  })
  @IsOptional()
  @IsBoolean({ message: 'O status deve ser verdadeiro ou falso' })
  completed?: boolean;
}