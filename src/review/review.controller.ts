import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { CurrentUser } from '../user/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Auth()
  @Get(':productId')
  async getByProductId(@Param('productId') productId: string) {
    return this.reviewService.getByProductId(productId);
  }

  @Auth()
  @Post(':productId/:storeId')
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.reviewService.create(dto, userId, productId, storeId);
  }

  @Auth()
  @Put(':id')
  async update(
    @Body() dto: UpdateReviewDto,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.reviewService.update(dto, id, userId);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.reviewService.delete(id, userId);
  }
}
