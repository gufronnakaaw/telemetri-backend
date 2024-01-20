import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { CustomError } from '../errors/custom.error';
import { hash, verify } from '../utils/bcrypt.util';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(data: LoginDto) {
    const { email, password } = data;

    const check = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!check) {
      throw new CustomError(400, 'email or password wrong');
    }

    if (!(await verify(password, check.password))) {
      throw new CustomError(400, 'email or password wrong');
    }

    const token = randomUUID().replace(/-/g, '');

    await this.prisma.token.create({
      data: {
        token,
      },
    });

    return {
      email,
      fullname: check.fullname,
      role: check.role,
      token,
    };
  }

  async register(data: RegisterDto) {
    const check = await this.prisma.user.count({
      where: {
        email: data.email,
      },
    });

    if (check > 0) {
      throw new CustomError(400, 'email already registered');
    }

    await this.prisma.user.create({
      data: {
        email: data.email,
        fullname: data.fullname,
        password: await hash(data.password),
        role: data.role,
      },
    });
  }
}
