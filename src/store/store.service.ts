import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStoreById(storeId: string, userId: string) {
    const store = await this.prismaService.store.findUnique({
      where: {
        id: storeId,
        userId: userId,
      },
    });

    if (!store) {
      throw new NotFoundException(
        'Store not found or you are not owner of this store',
      );
    }

    return store;
  }

  async create(dto: CreateStoreDto, userId: string) {
    return this.prismaService.store.create({
      data: {
        title: dto.title,
        userId: userId,
      },
    });
  }

  async update(dto: UpdateStoreDto, userId: string, storeId: string) {
    await this.getStoreById(storeId, userId);

    return this.prismaService.store.update({
      data: {
        ...dto,
      },
      where: {
        id: storeId,
        userId: userId,
      },
    });
  }

  async delete(userId: string, storeId: string) {
    await this.getStoreById(storeId, userId);

    return this.prismaService.store.delete({
      where: {
        id: storeId,
        userId: userId,
      },
    });
  }
}
