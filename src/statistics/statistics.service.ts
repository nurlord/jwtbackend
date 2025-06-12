import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from '../prisma/prisma.service';

const monthNames = [
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May.',
  'Jun.',
  'Jul.',
  'Aug.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.',
];

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMainStatistics(storeId: string, userId: string) {
    const store = await this.prismaService.store.findUnique({
      where: { userId: userId, id: storeId },
    });
    if (!store) {
      throw new NotFoundException(
        'Store statistics not found or you are not owner of this store',
      );
    }

    const totalRevenue = await this.calculateTotalRevenue(storeId, userId);

    const productsCount = await this.countProducts(storeId, userId);
    const categoriesCount = await this.countCategories(storeId, userId);

    const averageRating = await this.calculateAverageRating(storeId, userId);

    return [
      { id: 1, name: 'Revenue', value: totalRevenue },
      { id: 2, name: 'Products', value: productsCount },
      { id: 3, name: 'Categories', value: categoriesCount },
      { id: 4, name: 'Average rating', value: averageRating },
    ];
  }

  async getMiddleStatistics(storeId: string, userId: string) {
    const store = await this.prismaService.store.findUnique({
      where: { userId: userId, id: storeId },
    });

    if (!store) {
      throw new NotFoundException(
        'Store statistics not found or you are not owner of this store',
      );
    }

    const monthlySales = await this.calculateMonthlySales(storeId, userId);
    const lastUsers = await this.getLastUsers(storeId, userId);

    return { monthlySales, lastUsers };
  }

  private async calculateTotalRevenue(storeId: string, userId: string) {
    const result = await this.prismaService.orderItem.aggregate({
      where: {
        storeId: storeId,
        store: {
          userId: userId,
        },
      },
      _sum: {
        total: true,
      },
    });
    return Number(result._sum.total) || 0;
  }

  private async countProducts(storeId: string, userId: string) {
    const count = await this.prismaService.product.count({
      where: {
        storeId,
        store: {
          userId: userId,
        },
      },
    });
    return count;
  }

  private async countCategories(storeId: string, userId: string) {
    const count = await this.prismaService.category.count({
      where: { storeId, store: { userId: userId } },
    });
    return count;
  }

  private async calculateAverageRating(storeId: string, userId: string) {
    const averageRating = await this.prismaService.review.aggregate({
      where: { storeId, store: { userId } },
      _avg: {
        rating: true,
      },
    });
    return averageRating._avg.rating;
  }

  private async calculateMonthlySales(storeId: string, userId: string) {
    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();

    const salesRaw = await this.prismaService.orderItem.findMany({
      where: {
        storeId: storeId,
        store: {
          userId,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const formatDate = (date: Date): string => {
      return `${monthNames[date.getMonth()]} ${date.getDate()}`;
    };

    const salesByDate = new Map<string, number>();

    salesRaw.forEach((orderItem) => {
      const formattedDate = formatDate(new Date(orderItem.createdAt));

      if (salesByDate.has(formattedDate)) {
        salesByDate.set(
          formattedDate,
          salesByDate.get(formattedDate)! + orderItem.total,
        );
      } else {
        salesByDate.set(formattedDate, orderItem.total);
      }
    });

    const monthlySales = Array.from(salesByDate, ([date, value]) => ({
      date,
      value,
    }));

    return monthlySales;
  }

  private async getLastUsers(storeId: string, userId: string) {
    const lastUsers = await this.prismaService.user.findMany({
      where: {
        orders: {
          some: {
            items: { some: { storeId, store: { userId } } },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        orders: {
          where: {
            items: { some: { storeId, store: { userId } } },
          },
          include: {
            items: {
              where: {
                storeId,
                store: { userId },
              },
              select: {
                price: true,
              },
            },
          },
        },
      },
    });
    return lastUsers.map((user) => {
      const lastOrder = user.orders[user.orders.length - 1];
      return {
        ...user,
        total: lastOrder.total,
      };
    });
  }
}
