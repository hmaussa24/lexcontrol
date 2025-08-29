import { Module } from '@nestjs/common';
import { CaseActionsService } from './case-actions.service';
import { CaseActionsController } from './case-actions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CaseActionsController],
  providers: [CaseActionsService],
})
export class CaseActionsModule {}


