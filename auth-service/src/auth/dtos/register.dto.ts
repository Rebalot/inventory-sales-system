import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
    @IsOptional()
    @IsIn(['user', 'admin']) // Solo permite estos dos valores
    role?: string;
}