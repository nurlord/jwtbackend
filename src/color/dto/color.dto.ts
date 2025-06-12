import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateColorDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class UpdateColorDto extends PartialType(CreateColorDto) {}
