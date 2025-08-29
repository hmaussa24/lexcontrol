import { Module } from '@nestjs/common';
import { CaseNotesService } from './case-notes.service';
import { CaseNotesController } from './case-notes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CaseNotesController],
  providers: [CaseNotesService],
})
export class CaseNotesModule {}


