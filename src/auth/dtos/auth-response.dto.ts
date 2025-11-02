import { ApiProperty } from '@nestjs/swagger';
export class AuthResponseDto {
    @ApiProperty({
        description: 'Token de acceso JWT',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    access_token: string;
    @ApiProperty({
        description: 'Tipo de token',
        example: 'Bearer',
    })
    token_type: string;
    @ApiProperty({
        description: 'Tiempo de expiración en segundos',
        example: 3600,
    })
    expires_in: number;
}
