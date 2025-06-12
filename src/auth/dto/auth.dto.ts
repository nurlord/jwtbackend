import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
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

export class LoginDto {
  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(6, {
    message: 'Password is too short',
  })
  password: string;
}

export class UpdateUserDto extends PartialType(RegisterDto) {}
