import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { RegisterDto } from '../auth/dto/auth.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id);
  }

  @Auth()
  @Patch('profile')
  async updateProfile(@CurrentUser('id') id: string, @Body() dto: RegisterDto) {
    return this.userService.updateProfile(id, dto);
  }

  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.userService.toggleFavorite(productId, userId);
  }
}
