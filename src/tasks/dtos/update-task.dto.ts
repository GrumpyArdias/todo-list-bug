import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiPropertyOptional({
        description: 'Título de la tarea',
        example: 'Comprar leche y pan',
    })
    title?: string;
    @ApiPropertyOptional({
        description: 'Descripción detallada de la tarea',
        example: 'Ir al supermercado y comprar leche y pan integral',
    })
    description?: string;
    @ApiPropertyOptional({
        description: 'Estado de la tarea',
        example: true,
    })
    done?: boolean;
    @ApiPropertyOptional({
        description: 'Fecha límite para completar la tarea',
        example: '2025-11-11T18:00:00.000Z',
    })
    dueDate?: string;
}
