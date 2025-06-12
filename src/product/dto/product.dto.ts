import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty({
    each: true,
  })
  @ArrayMinSize(1, { message: 'Upload at least one image' })
  @IsString({
    each: true,
  })
  images: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  colorId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
