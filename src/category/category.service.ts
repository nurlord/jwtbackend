import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.category.findMany();
  }

  async getById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto, storeId: string) {
    try {
      return this.prismaService.category.create({
        data: {
          title: dto.title,
          description: dto.description,
        },
      });
    } catch (e) {
      throw new NotFoundException('Not valid storeId');
    }
  }

  async update(dto: UpdateCategoryDto, id: string) {
    await this.getById(id);
    return this.prismaService.category.update({
      data: {
        ...dto,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return this.prismaService.category.delete({
      where: {
        id,
      },
    });
  }
}
