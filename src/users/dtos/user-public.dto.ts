import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { PickType } from '@nestjs/mapped-types';

// Aquí uso PickType para que se muestren los campos que quiero en los retornos,
// podría usar fromEntity también, pero con PickType
// determino a los campos que quiero y en runtime tengo una clase igual, pero sin logica extra
export class UserPublicDto extends PickType(User, [
    'id',
    'email',
    'fullname',
] as const) {
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
