import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auht.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Auth = () =>
  applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
