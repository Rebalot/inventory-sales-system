import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    } from '@nestjs/common';
    import { Request } from 'express';
    import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

    @Injectable()
    export class HttpAuthGuard implements CanActivate {
        constructor(private readonly authService: AuthService) {}
    
        async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = request.cookies?.['session'];

        if (!token) {
            throw new UnauthorizedException('Token missing');
        }
    
        try {
            const user = await this.authService.validateToken(token);
            request['user'] = user;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
        }
    }