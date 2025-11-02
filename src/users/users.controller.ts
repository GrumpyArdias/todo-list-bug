import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
// import { UserPublicDto } from './dtos/user-public.dto';
// import { AuthGuard } from 'src/auth/auth.guard';
// import { UpdateUserDto } from './dtos/update-user.dto';
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Crear nuevo usuario',
        description: 'Registra un nuevo usuario en el sistema',
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario creado exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000',
                },
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: 'El email ya está registrado',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos',
    })
    @ApiBody({
        type: CreateUserDto,
        description: 'Datos del nuevo usuario',
    })
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<{ id: string }> {
        const userId = await this.usersService.create(createUserDto);
        return { id: userId };
    }

    // @Patch('/update/:id')
    // @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard)
    // async updateUser(
    //     @Param('id') id: string,
    //     @Body() updateUserDto: UpdateUserDto,
    // ): Promise<UserPublicDto> {
    //     const user = await this.usersService.updateUser(id, updateUserDto);
    //     return user;
    // }

    // @Get('/all')
    // @UseGuards(AuthGuard)
    // async findAll(): Promise<UserPublicDto[]> {
    //     const users = await this.usersService.findAll();
    //     return users;
    // }

    // @Get('/:id')
    // @UseGuards(AuthGuard)
    // async findById(@Param('id') id: string): Promise<UserPublicDto> {
    //     const user = await this.usersService.findById(id);
    //     return user;
    // }

    // @Delete('/delete/:id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @UseGuards(AuthGuard)
    // async deleteUser(@Param('id') id: string): Promise<void> {
    //     await this.usersService.deleteUser(id);
    // }
}
