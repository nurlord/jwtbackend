import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
