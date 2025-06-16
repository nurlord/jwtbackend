import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
