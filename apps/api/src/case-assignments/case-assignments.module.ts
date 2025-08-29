import { Module } from '@nestjs/common';
import { CaseAssignmentsService } from './case-assignments.service';
import { CaseAssignmentsController } from './case-assignments.controller';

@Module({
  controllers: [CaseAssignmentsController],
  providers: [CaseAssignmentsService],
  exports: [CaseAssignmentsService],
})
export class CaseAssignmentsModule {}


