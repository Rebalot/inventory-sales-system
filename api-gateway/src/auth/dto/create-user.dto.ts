import { ArrayNotEmpty, IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../types/role.type';

const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @Matches(namePattern, {
        message: 'First name must be one or more words with only letters and single spaces',
      })
    firstName!: string;

    @IsOptional()
    @IsString()
    @Matches(namePattern, {
        message: 'Last name must be one or more words with only letters and single spaces',
      })
    lastName?: string;

    @IsOptional()
    @Transform(({ value }) => 
        typeof value === 'string' ? [value] : value
    )
    @IsString({ each: true })
    @IsIn(['user', 'admin', 'sales', 'inventory', 'analytics'], { each: true })
    @ArrayNotEmpty()
    role: Role[] = ['user'];
}