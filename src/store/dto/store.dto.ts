import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;
}

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
