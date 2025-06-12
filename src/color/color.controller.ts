import { ColorService } from './color.service';

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
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';
@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Auth()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.colorService.getById(id);
  }

  @Auth()
  @Post(':storeId')
  async create(@Body() dto: CreateColorDto, @Param('storeId') storeId: string) {
    return this.colorService.create(dto, storeId);
  }

  @Auth()
  @Put(':id')
  async update(@Body() dto: UpdateColorDto, @Param('id') id: string) {
    return this.colorService.update(dto, id);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.colorService.delete(id);
  }
}
