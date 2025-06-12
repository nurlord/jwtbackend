import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth()
  @Post()
  async placeOrder(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return this.orderService.placeOrder(dto, userId);
  }
}
