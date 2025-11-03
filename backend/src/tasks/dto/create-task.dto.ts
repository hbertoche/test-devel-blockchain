import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Estudar NestJS',
    maxLength: 255
  })
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres' })
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example: 'Aprender sobre modules, controllers e services no NestJS',
    maxLength: 1000,
    required: false
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  @MaxLength(1000, { message: 'A descrição deve ter no máximo 1000 caracteres' })
  description?: string;
}