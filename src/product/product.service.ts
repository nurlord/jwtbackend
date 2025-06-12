import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm);

    return await this.prismaService.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        color: true,
        reviews: true,
        store: true,
      },
    });
  }

  private async getSearchTermFilter(searchTerm: string) {
    return this.prismaService.product.findMany({
      where: {
        OR: [
          {
            title: { contains: searchTerm, mode: 'insensitive' },
          },
          {
            description: { contains: searchTerm, mode: 'insensitive' },
          },
        ],
      },
      include: {
        category: true,
        color: true,
        reviews: true,
        store: true,
      },
    });
  }

  async getByStoreId(storeId: string) {
    return await this.prismaService.product.findMany({
      where: { storeId: storeId },
      include: {
        category: true,
        color: true,
        reviews: true,
        store: true,
      },
    });
  }

  async getById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        color: true,
        reviews: {
          include: {
            user: true,
          },
        },
        store: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getByCategory(categoryId: string) {
    const products = await this.prismaService.product.findMany({
      where: { categoryId: categoryId },
      include: {
        category: true,
        color: true,
        reviews: true,
        store: true,
      },
    });

    if (!products) {
      throw new NotFoundException('Products not found');
    }

    return products;
  }
  async getMostPopular() {
    const mostPopularProducts = await this.prismaService.product.findMany({
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      include: {
        category: true,
        color: true,
        reviews: true,
        store: true,
      },
    });

    return mostPopularProducts;
  }

  async getSimilar(productId: string) {
    const currentProduct = await this.getById(productId);

    if (!currentProduct) {
      throw new NotFoundException('Product not found');
    }

    const products = await this.prismaService.product.findMany({
      where: {
        category: currentProduct.category,
        NOT: {
          id: productId,
        },
      },
      include: {
        category: true,
        color: true,
        reviews: true,
        store: true,
      },
    });
    return products;
  }

  async create(dto: CreateProductDto, storeId: string) {
    try {
      return this.prismaService.product.create({
        data: {
          title: dto.title,
          description: dto.description,
          price: dto.price,
          storeId: storeId,
          images: dto.images,
          colorId: dto.colorId,
          categoryId: dto.categoryId,
        },
        include: {
          category: true,
          color: true,
          reviews: true,
          store: true,
        },
      });
    } catch (e) {
      throw new NotFoundException('Not valid storeId');
    }
  }

  async update(dto: UpdateProductDto, id: string) {
    await this.getById(id);
    return this.prismaService.product.update({
      data: {
        ...dto,
      },
      where: {
        id,
      },
      include: {
        category: true,
        color: true,
        reviews: true,
        store: true,
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return this.prismaService.product.delete({
      where: {
        id,
      },
      include: {
        category: true,
        color: true,
        reviews: true,
        store: true,
      },
    });
  }
}
