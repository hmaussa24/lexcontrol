import { Module } from '@nestjs/common';
import { CaseTasksService } from './case-tasks.service';
import { CaseTasksController } from './case-tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CaseTasksController],
  providers: [CaseTasksService],
})
export class CaseTasksModule {}


