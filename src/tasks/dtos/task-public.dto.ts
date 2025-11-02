import { Task } from '../../entities/task.entity';
import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class TaskPublicDto extends PickType(Task, [
    'id',
    'title',
    'description',
    'done',
    'dueDate',
] as const) {
    @ApiProperty({
        description: 'ID único de la tarea',
        example: '456e7890-e89b-12d3-a456-426614174111',
    })
    id: string;
    @ApiProperty({
        description: 'Título de la tarea',
        example: 'Comprar leche',
    })
    title: string;
    @ApiProperty({
        description: 'Descripción detallada de la tarea',
        example: 'Ir al supermercado y comprar leche deslactosada',
    })
    description: string;
    @ApiProperty({
        description: 'Estado de la tarea (true=completada, false=pendiente)',
        example: false,
    })
    done: boolean;
    @ApiProperty({
        description: 'Fecha límite de la tarea',
        example: '2025-11-10T18:00:00.000Z',
    })
    dueDate: string;
}
