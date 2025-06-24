import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(searchTerm?: string, userId?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm);
    let favoriteIds: string[] = [];
    if (userId) {
      const userWithFavorites = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { favorites: { select: { id: true } } },
      });
      favoriteIds = userWithFavorites?.favorites.map((fav) => fav.id) ?? [];
    }
    const products = await this.prismaService.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, reviews: true, store: true },
    });
    return products.map((product) => ({
      ...product,
      isFavourite: favoriteIds.includes(product.id),
    }));
  }

  private async getSearchTermFilter(searchTerm: string, userId?: string) {
    let favoriteIds: string[] = [];
    if (userId) {
      const userWithFavorites = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { favorites: { select: { id: true } } },
      });
      favoriteIds = userWithFavorites?.favorites.map((fav) => fav.id) ?? [];
    }
    const products = await this.prismaService.product.findMany({
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
        reviews: true,
        store: true,
      },
    });
    return products.map((product) => ({
      ...product,
      isFavorite: favoriteIds.includes(product.id),
    }));
  }
  async getByStoreId(storeId: string) {
    return await this.prismaService.product.findMany({
      where: { storeId: storeId },
      include: {
        category: true,
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
        reviews: true,
        store: true,
      },
    });
    return products;
  }

  async create(dto: CreateProductDto, storeId: string) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id: dto.categoryId },
      });

      const store = await this.prismaService.store.findUnique({
        where: { id: storeId },
      });

      if (!category) {
        throw new NotFoundException('Category does not exist');
      }

      if (!store) {
        throw new NotFoundException('Store does not exist');
      }

      return this.prismaService.product.create({
        data: {
          title: dto.title,
          description: dto.description,
          price: dto.price,
          storeId: storeId,
          images: dto.images,
          categoryId: dto.categoryId,
        },
        include: {
          category: true,
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
        reviews: true,
        store: true,
      },
    });
  }
}
