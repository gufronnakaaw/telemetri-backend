import { Body, Controller, Post } from '@nestjs/common';
import { CustomException } from '../errors/custom.exception';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      const data = await this.authService.login(body);

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      await this.authService.register(body);

      return {
        success: true,
        message: 'the user has been created',
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
