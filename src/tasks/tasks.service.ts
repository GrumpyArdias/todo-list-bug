import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks(user: any) {
        const tasks = await this.tasksRepository.find({
            where: {
                owner: {
                    id: user.id,
                },
            },
            relations: ['owner'],
        });

        return tasks;
    }

    async getTask(id: string, user: any) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .andWhere('task.owner.id = :ownerId', { ownerId: user.id })
            .andWhere('task.id = :id', { id })
            .getOne();
        return task;
    }
    async editTask(user: any, body: any) {
        const id = body.id;
        const task = await this.getTask(id, user);

        if (!task) {
            throw new NotFoundException('Tarea no encontrada o no autorizada');
        }

        await this.tasksRepository.update(id, body);

        return this.getTask(id, user);
    }
}
