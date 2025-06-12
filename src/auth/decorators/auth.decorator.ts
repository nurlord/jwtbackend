import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auht.guard';

export const Auth = () => UseGuards(JwtAuthGuard);
