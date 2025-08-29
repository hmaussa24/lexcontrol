import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { BillingModule } from './billing/billing.module';
import { AuthModule } from './auth/auth.module';
import { CasesModule } from './cases/cases.module';
import { DeadlinesModule } from './deadlines/deadlines.module';
import { ClientsModule } from './clients/clients.module';
import { DocumentsModule } from './documents/documents.module';
import { HearingsModule } from './hearings/hearings.module';
import { CasePartiesModule } from './case-parties/case-parties.module';
import { CaseAssignmentsModule } from './case-assignments/case-assignments.module';
import { CaseActionsModule } from './case-actions/case-actions.module';
import { CaseNotesModule } from './case-notes/case-notes.module';
import { CaseTasksModule } from './case-tasks/case-tasks.module';
import { TaskAttachmentsModule } from './task-attachments/task-attachments.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { ExpensesModule } from './expenses/expenses.module';
import { StatsModule } from './stats/stats.module';
import { APP_GUARD } from '@nestjs/core';
import { SubscriptionGuard } from './auth/subscription.guard';
import { PublicSuggestionsModule } from './public-suggestions/public-suggestions.module';

@Module({
  imports: [PrismaModule, SupabaseModule, BillingModule, AuthModule, CasesModule, DeadlinesModule, ClientsModule, DocumentsModule, HearingsModule, CasePartiesModule, CaseAssignmentsModule, CaseActionsModule, CaseNotesModule, CaseTasksModule, TaskAttachmentsModule, TimeEntriesModule, ExpensesModule, StatsModule, PublicSuggestionsModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: SubscriptionGuard },
  ],
})
export class AppModule {}
