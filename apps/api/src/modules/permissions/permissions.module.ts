import { Global, Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { PermissionsGuard } from './guards/permissions.guard';

@Global()
@Module({
  providers: [AuthorizationService, PermissionsGuard],
  exports: [AuthorizationService, PermissionsGuard],
})
export class PermissionsModule {}
