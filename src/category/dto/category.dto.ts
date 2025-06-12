import { PartialType } from '@nestjs/mapped-types';
import { IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsString()
  @MaxLength(500)
  description: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
