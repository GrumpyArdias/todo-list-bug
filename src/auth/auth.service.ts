import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(loginDto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(loginDto.email);

        if (!user) {
            this.logger.log(`User with email ${loginDto.email} not found`);
            throw new UnauthorizedException();
        }

        if (user?.pass !== loginDto.pass) {
            this.logger.log(
                `Invalid password for user with email ${loginDto.email}`,
            );
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
            }),
        };
    }
}
