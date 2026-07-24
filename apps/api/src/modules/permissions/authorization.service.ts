import { Injectable } from '@nestjs/common';

export interface ResourceContext {
  organizationId?: string;
  departmentId?: string;
  assignedSpecialistId?: string;
  parentUserId?: string;
}

@Injectable()
export class AuthorizationService {
  /**
   * Centralized evaluation of actor permissions.
   * Never relies on role string checks alone.
   */
  authorize(
    actorPermissions: string[],
    requiredPermission: string,
    _context?: ResourceContext,
  ): boolean {
    if (!actorPermissions || actorPermissions.length === 0) {
      return false;
    }

    // System manage or exact match
    if (actorPermissions.includes('system.manage')) {
      return true;
    }

    if (actorPermissions.includes(requiredPermission)) {
      return true;
    }

    // Namespace wildcard check (e.g., case.*)
    const [namespace] = requiredPermission.split('.');
    if (actorPermissions.includes(`${namespace}.*`)) {
      return true;
    }

    return false;
  }
}
