import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'argon2';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        stores: true,
        orders: true,
        reviews: true,
        favorites: {
          include: { category: true },
        },
      },
    });

    return user;
  }

  async updateProfile(id: string, dto: RegisterDto) {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        stores: true,
        favorites: true,
      },
    });

    return user;
  }

  async toggleFavorite(productId: string, userId: string) {
    await this.prismaService.$transaction(async (prisma) => {
      const userFavorites = await prisma.user.findUnique({
        where: { id: userId },
        select: { favorites: { select: { id: true } } },
      });

      const isExists = userFavorites?.favorites.some(
        (product) => product.id === productId,
      );

      await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            [isExists ? 'disconnect' : 'connect']: { id: productId },
          },
        },
      });
    });
    return true;
  }

  async create(dto: RegisterDto) {
    return this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      },
    });
  }
}
