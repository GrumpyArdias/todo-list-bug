import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskPublicDto } from './dtos/task-public.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async createTask(
        user: User,
        CreateTaskDto: CreateTaskDto,
    ): Promise<{ id: string }> {
        const newTask = this.tasksRepository.create({
            title: CreateTaskDto.title,
            description: CreateTaskDto.description,
            done: CreateTaskDto.done ?? false,
            dueDate: CreateTaskDto.dueDate,
            owner: user,
        });

        const saved = await this.tasksRepository.save(newTask);

        if (!saved) throw new NotFoundException('Task could not be created');

        return { id: saved.id };
    }

    async listTasks(user: User): Promise<TaskPublicDto[] | []> {
        const tasks = await this.tasksRepository.find({
            where: { owner: { id: user.id } },
            select: ['id', 'title', 'description', 'done', 'dueDate'],
        });

        if (tasks.length === 0) {
            return [];
        }

        return plainToInstance(TaskPublicDto, tasks);
    }

    async getTask(id: string, user: User): Promise<TaskPublicDto> {
        const task = await this.tasksRepository.findOne({
            where: { id, owner: { id: user.id } },
            select: ['id', 'title', 'description', 'done', 'dueDate'],
        });
        if (!task) {
            throw new ForbiddenException('Task not found or access denied');
        }
        return plainToInstance(TaskPublicDto, task);
    }
    async editTask(
        id: string,
        user: User,
        updateTaskDto: UpdateTaskDto,
    ): Promise<TaskPublicDto> {
        const task = await this.tasksRepository.findOne({
            where: { id, owner: { id: user.id } },
        });

        if (!task) {
            throw new ForbiddenException('Task not found or not authorized');
        }

        if (updateTaskDto.title !== undefined) task.title = updateTaskDto.title;
        if (updateTaskDto.description !== undefined)
            task.description = updateTaskDto.description;
        if (updateTaskDto.done !== undefined) task.done = updateTaskDto.done;
        if (updateTaskDto.dueDate !== undefined)
            task.dueDate = updateTaskDto.dueDate;

        await this.tasksRepository.save(task);

        return plainToInstance(TaskPublicDto, task);
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.tasksRepository.delete({
            id,
            owner: { id: user.id },
        });
        if (result.affected === 0)
            throw new ForbiddenException('Task not found or not authorized');
    }
}
