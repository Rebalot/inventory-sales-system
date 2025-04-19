import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto extends LoginDto {} // Hereda las mismas validaciones