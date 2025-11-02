import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez',
        minLength: 1,
    })
    @IsNotEmpty({ message: 'Fullname is required' })
    @IsString()
    fullname: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@test.com',
        format: 'email',
    })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'password123',
        minLength: 8,
        format: 'password',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    pass: string;
}
