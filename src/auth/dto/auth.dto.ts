import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString({ message: 'Password is required' })
  @MinLength(6, {
    message: 'Password is too short',
  })
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString({ message: 'Password is required' })
  @MinLength(6, {
    message: 'Password is too short',
  })
  password: string;
}

export class UpdateUserDto extends PartialType(RegisterDto) {}
