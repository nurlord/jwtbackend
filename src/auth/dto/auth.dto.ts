import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(6, {
    message: 'Password is too short',
  })
  password: string;
}
