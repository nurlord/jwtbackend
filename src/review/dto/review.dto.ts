import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
