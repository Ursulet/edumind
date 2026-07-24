import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuditModule } from './modules/audit/audit.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { CmsModule } from './modules/cms/cms.module';
import { FamiliesModule } from './modules/families/families.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CasesModule } from './modules/cases/cases.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrdersModule } from './modules/orders/orders.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    PermissionsModule,
    AuthModule,
    HealthModule,
    CmsModule,
    FamiliesModule,
    ApplicationsModule,
    CasesModule,
    CatalogModule,
    OrdersModule,
    WorkflowsModule,
    AssessmentsModule,
    ReportsModule,
    SchedulingModule,
    SessionsModule,
    RecommendationsModule,
    NotificationsModule,
    SearchModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}

