import { Module } from '@nestjs/common';
import { PublicSuggestionsController } from './public-suggestions.controller';
import { PublicSuggestionsService } from './public-suggestions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PublicSuggestionsController],
  providers: [PublicSuggestionsService],
})
export class PublicSuggestionsModule {}


