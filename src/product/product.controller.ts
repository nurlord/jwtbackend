import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm);
  }

  @Auth()
  @Get('by-storeId/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.productService.getByStoreId(storeId);
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @Get('by-category/:categoryId')
  async getByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getByCategory(categoryId);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.productService.getMostPopular();
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(id);
  }

  @Auth()
  @Post(':storeId')
  async create(
    @Body() dto: CreateProductDto,
    @Param('storeId') storeId: string,
  ) {
    return this.productService.create(dto, storeId);
  }

  @Auth()
  @Put(':id')
  async update(@Body() dto: UpdateProductDto, @Param('id') id: string) {
    return this.productService.update(dto, id);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
