import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async placeOrder(dto: OrderDto, userId: string) {
    const total = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await this.prismaService.order.create({
      data: {
        status: 'PAYED',
        total,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            storeId: item.storeId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
        userId,
      },
    });
    return true;
  }
}
