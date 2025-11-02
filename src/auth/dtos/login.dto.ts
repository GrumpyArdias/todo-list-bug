import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginDto {
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
        format: 'password',
        minLength: 8,
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    pass: string;
}
