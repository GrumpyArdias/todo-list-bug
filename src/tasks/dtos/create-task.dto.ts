import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateTaskDto {
    @ApiProperty({
        description: 'Título de la tarea',
        example: 'Comprar leche',
        minLength: 1,
    })
    @IsNotEmpty({ message: 'Title is required' })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Descripción detallada de la tarea',
        example: 'Ir al supermercado y comprar leche deslactosada',
    })
    @IsNotEmpty({ message: 'Description is required' })
    @IsString()
    description: string;

    @ApiPropertyOptional({
        description: 'Estado de la tarea (completada o pendiente)',
        example: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    done?: boolean = false;

    @ApiProperty({
        description: 'Fecha límite para completar la tarea',
        example: '2025-11-10T18:00:00.000Z',
        format: 'date-time',
    })
    @IsNotEmpty({ message: 'Due date is required' })
    @IsString()
    dueDate: string;
}
