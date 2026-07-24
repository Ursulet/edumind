import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authzService: AuthorizationService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException({
        error: 'FORBIDDEN',
        message: 'User authentication required for permission check',
      });
    }

    const hasPermission = requiredPermissions.every((perm) =>
      this.authzService.authorize(user.permissions, perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException({
        error: 'PERMISSION_DENIED',
        message: `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      });
    }

    return true;
  }
}
