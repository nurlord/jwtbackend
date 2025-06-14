import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { EnumOrderStatus } from '@/prisma/generated';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByProductId(productId: string) {
    return await this.prismaService.review.findMany({
      where: { productId: productId },
      include: { user: true },
    });
  }

  async getById(id: string, userId: string) {
    const review = await this.prismaService.review.findUnique({
      where: {
        id,
        userId,
      },
      include: { user: true },
    });

    if (!review) {
      throw new NotFoundException(
        'Review not found or you are not author of the review',
      );
    }

    return review;
  }

  async create(
    dto: CreateReviewDto,
    userId: string,
    productId: string,
    storeId: string,
  ) {
    try {
      const hasOrdered = !!(await this.prismaService.order.findFirst({
        where: {
          userId: userId,
          items: {
            some: {
              productId: productId,
            },
          },
          status: EnumOrderStatus.PAYED,
        },
        select: { id: true },
      }));
      if (!hasOrdered) {
        return new NotFoundException('User dont have this product in orders');
      } else {
        return this.prismaService.review.create({
          data: {
            text: dto.text,
            rating: dto.rating,
            user: { connect: { id: userId } },
            product: { connect: { id: productId } },
            store: { connect: { id: storeId } },
          },
        });
      }
    } catch (e) {
      throw new NotFoundException('Not valid input');
    }
  }

  async update(dto: UpdateReviewDto, id: string, userId: string) {
    await this.getById(id, userId);
    return this.prismaService.review.update({
      data: {
        ...dto,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    return this.prismaService.review.delete({
      where: {
        id,
      },
    });
  }
}
