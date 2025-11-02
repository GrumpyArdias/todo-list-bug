import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './is-public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @IsPublic()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Autentica un usuario y devuelve un token JWT',
    })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos',
    })
    @ApiBody({
        type: LoginDto,
        description: 'Credenciales de acceso',
    })
    signIn(@Body() loginDto: LoginDto) {
        return this.authService.signIn(loginDto);
    }
}
