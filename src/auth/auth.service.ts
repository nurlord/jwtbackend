import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '@/prisma/generated';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { verify } from 'argon2';
import { LoginDto, RegisterDto } from './dto/auth.dto';

export interface JwtPayload {
  id: string;
}

export interface JwtRespone extends JwtPayload {
  iat: number;
  exp: number;
}

export interface Tokens {
  accessToken: string;
}

export interface GetNewTokensResponse extends Tokens {
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async register(dto: RegisterDto) {
    const oldUser = await this.userService.getByEmail(dto.email);
    if (oldUser) throw new BadRequestException('User already exists');

    const user = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async getNewTokens(refreshToken: string): Promise<GetNewTokensResponse> {
    const result = await this.jwt.verifyAsync<JwtRespone>(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.getById(result.id);
    if (!user) throw new UnauthorizedException('User not found');

    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  private issueTokens(userId: string): Tokens {
    const payload: JwtPayload = { id: userId };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: '15d',
    });

    return { accessToken };
  }

  private async validateUser(dto: LoginDto): Promise<User> {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    if (!user.password) throw new BadRequestException('Password is required');
    const passwordMatches = await verify(user.password, dto.password);
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');
    return user;
  }
}
