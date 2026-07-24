import { describe, it, expect, beforeEach } from 'vitest';
import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(() => {
    service = new AuthorizationService();
  });

  it('should grant access if system.manage is present', () => {
    const result = service.authorize(['system.manage'], 'case.read.own');
    expect(result).toBe(true);
  });

  it('should grant access if exact permission is present', () => {
    const result = service.authorize(['case.read.assigned', 'user.read'], 'case.read.assigned');
    expect(result).toBe(true);
  });

  it('should grant access if namespace wildcard is present', () => {
    const result = service.authorize(['case.*'], 'case.read.department');
    expect(result).toBe(true);
  });

  it('should deny access if permission is missing', () => {
    const result = service.authorize(['case.read.own'], 'user.manage');
    expect(result).toBe(false);
  });

  it('should deny access if actor has no permissions', () => {
    const result = service.authorize([], 'case.read.own');
    expect(result).toBe(false);
  });
});
