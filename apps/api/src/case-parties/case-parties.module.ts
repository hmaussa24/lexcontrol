import { Module } from '@nestjs/common';
import { CasePartiesService } from './case-parties.service';
import { CasePartiesController } from './case-parties.controller';

@Module({
  controllers: [CasePartiesController],
  providers: [CasePartiesService],
  exports: [CasePartiesService],
})
export class CasePartiesModule {}


