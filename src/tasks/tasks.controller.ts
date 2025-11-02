import { UpdateTaskDto } from './dtos/update-task.dto';
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    Delete,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
    ApiParam,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { User as UserEntity } from 'src/entities/user.entity';
import { TaskPublicDto } from './dtos/task-public.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Crear nueva tarea',
        description: 'Crea una nueva tarea para el usuario autenticado',
    })
    @ApiResponse({
        status: 201,
        description: 'Tarea creada exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '456e7890-e89b-12d3-a456-426614174111',
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiBody({ type: CreateTaskDto })
    async createTasks(
        @User() user: UserEntity,
        @Body() createTaskDto: CreateTaskDto,
    ) {
        return this.tasksService.createTask(user, createTaskDto);
    }

    @Get('')
    @ApiOperation({
        summary: 'Listar tareas del usuario',
        description: 'Obtiene todas las tareas del usuario autenticado',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de tareas obtenida exitosamente',
        type: [TaskPublicDto],
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(AuthGuard)
    async listTasks(@User() user: UserEntity) {
        return this.tasksService.listTasks(user);
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Obtener tarea específica',
        description: 'Obtiene una tarea específica del usuario autenticado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la tarea',
        example: '456e7890-e89b-12d3-a456-426614174111',
    })
    @ApiResponse({
        status: 200,
        description: 'Tarea obtenida exitosamente',
        type: TaskPublicDto,
    })
    @ApiResponse({ status: 403, description: 'Acceso denegado' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async getTask(@Param('id') id: string, @User() user: UserEntity) {
        return this.tasksService.getTask(id, user);
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Actualizar tarea',
        description: 'Actualiza una tarea específica del usuario autenticado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la tarea a actualizar',
        example: '456e7890-e89b-12d3-a456-426614174111',
    })
    @ApiResponse({
        status: 200,
        description: 'Tarea actualizada exitosamente',
        type: TaskPublicDto,
    })
    @ApiResponse({ status: 403, description: 'Acceso denegado' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiBody({ type: UpdateTaskDto })
    async editTask(
        @Param('id') id: string,
        @User() user: UserEntity,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.tasksService.editTask(id, user, updateTaskDto);
    }
    @Delete('/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Eliminar tarea',
        description: 'Elimina una tarea específica del usuario autenticado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la tarea a eliminar',
        example: '456e7890-e89b-12d3-a456-426614174111',
    })
    @ApiResponse({
        status: 200,
        description: 'Tarea eliminada exitosamente',
    })
    @ApiResponse({ status: 403, description: 'Acceso denegado' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async deleteTask(@Param('id') id: string, @User() user: UserEntity) {
        return this.tasksService.deleteTask(id, user);
    }
}
