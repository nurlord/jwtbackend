import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string) {
    const color = await this.prismaService.color.findUnique({
      where: {
        id,
      },
    });

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    return color;
  }

  async create(dto: CreateColorDto, storeId: string) {
    try {
      return this.prismaService.color.create({
        data: {
          name: dto.name,
          value: dto.value,
        },
      });
    } catch (e) {
      throw new NotFoundException('Not valid storeId');
    }
  }

  async update(dto: UpdateColorDto, id: string) {
    await this.getById(id);
    return this.prismaService.color.update({
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
    return this.prismaService.color.delete({
      where: {
        id,
      },
    });
  }
}
