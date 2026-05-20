import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/db/database.module';
import { UsersModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth.guard';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { NotificationModule } from './modules/notification/notification.module';
import { InvitationModule } from './modules/invite/invite.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { CategoriesModule } from './modules/category/category.module';
import { GroupModule } from './modules/group/group.module';
import { SubscriptionPeriodModule } from './modules/subscription-period/subscription-period.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    WorkspaceModule,
    NotificationModule,
    InvitationModule,
    WebSocketModule,
    CategoriesModule,
    GroupModule,
    SubscriptionPeriodModule,
    TicketModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
