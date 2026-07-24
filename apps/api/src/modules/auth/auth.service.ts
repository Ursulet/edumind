import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto, ImpersonateDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async login(dto: LoginDto, requestInfo: { ip?: string; requestId?: string }) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
            organization: true,
          },
        },
      },
    });

    // Generic response to prevent user enumeration attacks
    if (!user) {
      throw new UnauthorizedException({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password provided',
      });
    }

    if (user.status === 'DISABLED' || user.status === 'SUSPENDED') {
      throw new ForbiddenException({
        error: 'ACCOUNT_DISABLED',
        message: 'Account access has been restricted',
      });
    }

    // 2. Verify password with Argon2
    const validPassword = await argon2.verify(user.passwordHash, dto.password);
    if (!validPassword) {
      // Audit failed login attempt
      await this.auditService.logEvent({
        actorUserId: user.id,
        action: 'user.login.failed',
        entityType: 'User',
        entityId: user.id,
        requestId: requestInfo.requestId,
        ipAddress: requestInfo.ip,
      });

      throw new UnauthorizedException({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password provided',
      });
    }

    // 3. Extract organization & permissions
    const primaryUserRole = user.userRoles[0];
    const organizationId = primaryUserRole?.organizationId || '';
    const roleName = primaryUserRole?.role?.name || 'PARENT';

    const permissionsSet = new Set<string>();
    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionsSet.add(rp.permission.action);
      }
    }
    const permissions = Array.from(permissionsSet);

    // 4. Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 5. Generate JWT token payload
    const payload = {
      sub: user.id,
      email: user.email,
      organizationId,
      role: roleName,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);

    // 6. Log successful audit event
    await this.auditService.logEvent({
      actorUserId: user.id,
      organizationId,
      action: 'user.login.success',
      entityType: 'User',
      entityId: user.id,
      requestId: requestInfo.requestId,
      ipAddress: requestInfo.ip,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roleName,
        organizationId,
        permissions,
      },
    };
  }

  /**
   * Impersonation mechanism for privileged roles (PLATFORM_OWNER / SUPER_ADMIN).
   * Mandates explicit reason and full audit logging.
   */
  async impersonate(
    actorId: string,
    dto: ImpersonateDto,
    requestInfo: { ip?: string; requestId?: string },
  ) {
    if (!dto.reason || dto.reason.trim().length < 10) {
      throw new BadRequestException({
        error: 'REASON_REQUIRED',
        message: 'A detailed reason (min 10 chars) is required for user impersonation',
      });
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: dto.targetUserId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!targetUser) {
      throw new BadRequestException({
        error: 'USER_NOT_FOUND',
        message: 'Target user for impersonation was not found',
      });
    }

    const primaryUserRole = targetUser.userRoles[0];
    const organizationId = primaryUserRole?.organizationId || '';
    const roleName = primaryUserRole?.role?.name || 'PARENT';

    const permissionsSet = new Set<string>();
    for (const ur of targetUser.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionsSet.add(rp.permission.action);
      }
    }

    const payload = {
      sub: targetUser.id,
      email: targetUser.email,
      organizationId,
      role: roleName,
      permissions: Array.from(permissionsSet),
      isImpersonating: true,
      impersonatorId: actorId,
    };

    const accessToken = this.jwtService.sign(payload);

    // Mandatory audit event with reason
    await this.auditService.logEvent({
      actorUserId: actorId,
      organizationId,
      action: 'user.impersonation.started',
      entityType: 'User',
      entityId: targetUser.id,
      requestId: requestInfo.requestId,
      ipAddress: requestInfo.ip,
      metadata: {
        reason: dto.reason,
        targetUserEmail: targetUser.email,
      },
    });

    return {
      accessToken,
      isImpersonating: true,
      impersonatorId: actorId,
      targetUser: {
        id: targetUser.id,
        email: targetUser.email,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        role: roleName,
      },
    };
  }
}
