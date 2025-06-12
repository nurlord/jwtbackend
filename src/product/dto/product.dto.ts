import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty({
    each: true,
  })
  @ArrayMinSize(1, { message: 'Upload at least one image' })
  @IsString({
    each: true,
  })
  images: string[];

  @IsNotEmpty()
  @IsString()
  colorId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
