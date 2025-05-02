import { ArrayNotEmpty, IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { LoginDto } from './login.dto';
import { Transform } from 'class-transformer';

const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
export class RegisterDto extends LoginDto {
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

    // @IsOptional()
    // @IsString()
    // avatarSeed?: string;

    @IsOptional()
    @Transform(({ value }) => 
        typeof value === 'string' ? [value] : value
    )
    @IsString({ each: true })
    @IsIn(['user', 'admin', 'sales', 'inventory', 'analysis'], { each: true })
    @ArrayNotEmpty()
    role: string[] = ['user'];
}