import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../common/prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  organizationId: string;
  role: string;
  permissions: string[];
  isImpersonating?: boolean;
  impersonatorId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => {
          if (req?.cookies?.em_token) return req.cookies.em_token;
          const cookieHeader = req?.headers?.cookie;
          if (cookieHeader) {
            const match = cookieHeader.match(/(?:^|;\s*)em_token=([^;]*)/);
            if (match) return match[1];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key-min-16-chars',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.status === 'DISABLED' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException({
        error: 'ACCOUNT_DISABLED',
        message: 'Account is disabled or no longer exists',
      });
    }

    return {
      id: user.id,
      email: user.email,
      organizationId: payload.organizationId,
      role: payload.role,
      permissions: payload.permissions,
      isImpersonating: payload.isImpersonating ?? false,
      impersonatorId: payload.impersonatorId,
    };
  }
}
