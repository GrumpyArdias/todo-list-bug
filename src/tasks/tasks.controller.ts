import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('')
    @UseGuards(AuthGuard)
    async listTasks(@User() user: any) {
        return this.tasksService.listTasks(user);
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    async getTask(@Param('id') id: string, @User() user: any) {
        return this.tasksService.getTask(id, user);
    }

    @Post('/edit')
    @UseGuards(AuthGuard)
    async editTask(@User() user: any, @Body() body) {
        return this.tasksService.editTask(user, body);
    }
}
