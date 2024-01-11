import { UserEnum } from '@prisma/client';

export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto {
  email: string;
  fullname: string;
  password: string;
  role: UserEnum;
}
