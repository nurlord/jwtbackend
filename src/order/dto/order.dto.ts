import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class OrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  productId: string;

  @IsString()
  storeId: string;
}
