import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, ImpersonateDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const requestId = (req as unknown as Record<string, string>)['requestId'];

    const result = await this.authService.login(dto, { ip, requestId });

    // Set cookie for web client (httpOnly: false so client can read it for Bearer tokens)
    res.cookie('em_token', result.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('em_token', { path: '/' });
    return { status: 'ok', message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return {
      user: (req as unknown as Record<string, unknown>)['user'],
    };
  }

  @Post('impersonate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('system.manage')
  @HttpCode(HttpStatus.OK)
  async impersonate(
    @Req() req: Request,
    @Body() dto: ImpersonateDto,
  ) {
    const user = (req as unknown as Record<string, { id: string }>)['user'];
    const ip = req.ip || '127.0.0.1';
    const requestId = (req as unknown as Record<string, string>)['requestId'];

    return this.authService.impersonate(user.id, dto, { ip, requestId });
  }
}
