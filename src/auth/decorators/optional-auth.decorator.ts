import { applyDecorators, UseGuards } from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../guards/optional-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const OptionalAuth = () =>
  applyDecorators(UseGuards(OptionalJwtAuthGuard), ApiBearerAuth());
