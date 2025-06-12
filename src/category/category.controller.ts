import { CategoryService } from './category.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from '@/prisma/generated';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getById(id);
  }

  @Auth()
  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(dto);
  }

  @Auth()
  @Put(':id')
  async update(
    @Body() dto: UpdateCategoryDto,
    @Param('id') id: string,
  ): Promise<Category> {
    return this.categoryService.update(dto, id);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Category> {
    return this.categoryService.delete(id);
  }
}
