import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'ID único del usuario',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@test.com',
    })
    email: string;
    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez',
    })
    fullname: string;
}
