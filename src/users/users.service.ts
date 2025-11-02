import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
// import { UserPublicDto } from './dtos/user-public.dto';
// import { plainToInstance } from 'class-transformer';
// import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(CreateUserDto: CreateUserDto): Promise<string> {
        const user = new User();
        const existingUser = await this.usersRepository.findOneBy({
            email: CreateUserDto.email,
        });

        if (existingUser)
            throw new ConflictException('User with this email already exists');

        user.email = CreateUserDto.email;
        user.pass = CreateUserDto.pass;
        user.fullname = CreateUserDto.fullname;

        // Tengo duddas sobre si es mejor en este caso hacer la asignacion manual o directamente con el metodo create.
        // como ustedes lo han creado inicialmente con la asignacion manual he dedicido seguir con la parte de la asignacion manual
        // con el motodo save, pero se podria hacer asi tambien:
        // const user = this.usersRepository.create(CreateUserDto);

        await this.usersRepository.save(user);

        return user.id;
    }

    // NOTE: Endpoints comentados intencionalmente
    // Razón: Por consistencia de seguridad, si un usuario no puede editar tareas de otros,
    // tampoco debería poder editar/eliminar usuarios de otros. Esto requeriría un sistema
    // de roles (admin/user) para una versión futura.

    // async updateUser(
    //     id: string,
    //     updateUserDto: UpdateUserDto,
    // ): Promise<UserPublicDto> {
    //     const user = await this.usersRepository.findOneBy({ id });
    //     if (!user) {
    //         throw new NotFoundException(`User with id ${id} not found`);
    //     }
    //     if (
    //         updateUserDto.email !== undefined &&
    //         updateUserDto.email !== user.email
    //     ) {
    //         const existingUser = await this.usersRepository.findOneBy({
    //             email: updateUserDto.email,
    //         });
    //         if (existingUser) {
    //             throw new ConflictException(
    //                 'User with this email already exists',
    //             );
    //         }
    //     }
    //     if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    //     if (updateUserDto.pass !== undefined) user.pass = updateUserDto.pass;
    //     if (updateUserDto.fullname !== undefined)
    //         user.fullname = updateUserDto.fullname;

    //     const updatedUser = await this.usersRepository.save(user);
    //     return {
    //         id: updatedUser.id,
    //         email: updatedUser.email,
    //         fullname: updatedUser.fullname,
    //     } as UserPublicDto;
    // }

    // async findAll(): Promise<UserPublicDto[]> {
    //     const users = await this.usersRepository.find({
    //         select: ['id', 'email', 'fullname'],
    //     });
    //     return plainToInstance(UserPublicDto, users);
    // }

    // async findById(id: string): Promise<UserPublicDto> {
    //     const user = await this.usersRepository.findOne({
    //         where: {
    //             id,
    //         },
    //         select: ['id', 'email', 'fullname'],
    //     });
    //     if (!user) {
    //         throw new NotFoundException(`User with id ${id} not found`);
    //     }

    //     return plainToInstance(UserPublicDto, user);
    // }
    /**
     * @internal
     * Solo para el Auth
     */
    async findOne(email: string) {
        const user = await this.usersRepository.findOneBy({
            email,
        });

        if (!user)
            throw new NotFoundException(`User with email ${email} not found`);

        return user;
    }

    // async deleteUser(id: string): Promise<void> {
    //     const user = await this.usersRepository.findOneBy({ id });
    //     if (!user) {
    //         throw new NotFoundException(`User with id ${id} not found`);
    //     }
    //     await this.usersRepository.remove(user);
    //     return;
    // }
}
