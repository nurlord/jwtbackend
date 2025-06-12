import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { User } from '@/prisma/generated';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { verify } from 'argon2';

export interface JwtPayload {
  id: string;
}

export interface JwtRespone extends JwtPayload {
  iat: number;
  exp: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface GetNewTokensResponse extends Tokens {
  user: User;
}

export interface GoogleOAuthRequest extends Request {
  user: {
    email: string;
    name: string;
    picture: string | null;
  };
}

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async register(dto: AuthDto) {
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
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    if (!user.password) throw new BadRequestException('Password is required');
    const passwordMatches = await verify(user.password, dto.password);
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async validateOAuthLogin({ user: googleUser }: GoogleOAuthRequest) {
    let user = await this.userService.getByEmail(googleUser.email);

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser?.picture || '/uploads/no-user-image.png',
        },
        include: {
          stores: true,
          favorites: true,
          orders: true,
        },
      });
    }

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date(
      Date.now() + this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60 * 1000,
    );
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.getOrThrow<string>('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.getOrThrow<string>('SERVER_DOMAIN'),
      secure: true,
      maxAge: 0,
      sameSite: 'none',
      path: '/',
    });
  }
}
