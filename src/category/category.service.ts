import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
    });
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

  async create(dto: CreateCategoryDto) {
    try {
      if (dto.parentId) {
        const isCategory = await this.prismaService.category.findUnique({
          where: { id: dto.parentId },
        });
        if (!isCategory) throw new NotFoundException('Category not found');
        return this.prismaService.category.create({
          data: {
            title: dto.title,
            description: dto.description,
            parentId: dto.parentId,
          },
        });
      }
      return this.prismaService.category.create({
        data: {
          title: dto.title,
          description: dto.description,
          parentId: null,
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
