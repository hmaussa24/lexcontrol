"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const supabase_module_1 = require("./supabase/supabase.module");
const billing_module_1 = require("./billing/billing.module");
const auth_module_1 = require("./auth/auth.module");
const cases_module_1 = require("./cases/cases.module");
const deadlines_module_1 = require("./deadlines/deadlines.module");
const clients_module_1 = require("./clients/clients.module");
const documents_module_1 = require("./documents/documents.module");
const hearings_module_1 = require("./hearings/hearings.module");
const case_parties_module_1 = require("./case-parties/case-parties.module");
const case_assignments_module_1 = require("./case-assignments/case-assignments.module");
const case_actions_module_1 = require("./case-actions/case-actions.module");
const case_notes_module_1 = require("./case-notes/case-notes.module");
const case_tasks_module_1 = require("./case-tasks/case-tasks.module");
const task_attachments_module_1 = require("./task-attachments/task-attachments.module");
const time_entries_module_1 = require("./time-entries/time-entries.module");
const expenses_module_1 = require("./expenses/expenses.module");
const stats_module_1 = require("./stats/stats.module");
const core_1 = require("@nestjs/core");
const subscription_guard_1 = require("./auth/subscription.guard");
const public_suggestions_module_1 = require("./public-suggestions/public-suggestions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, supabase_module_1.SupabaseModule, billing_module_1.BillingModule, auth_module_1.AuthModule, cases_module_1.CasesModule, deadlines_module_1.DeadlinesModule, clients_module_1.ClientsModule, documents_module_1.DocumentsModule, hearings_module_1.HearingsModule, case_parties_module_1.CasePartiesModule, case_assignments_module_1.CaseAssignmentsModule, case_actions_module_1.CaseActionsModule, case_notes_module_1.CaseNotesModule, case_tasks_module_1.CaseTasksModule, task_attachments_module_1.TaskAttachmentsModule, time_entries_module_1.TimeEntriesModule, expenses_module_1.ExpensesModule, stats_module_1.StatsModule, public_suggestions_module_1.PublicSuggestionsModule],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: subscription_guard_1.SubscriptionGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map