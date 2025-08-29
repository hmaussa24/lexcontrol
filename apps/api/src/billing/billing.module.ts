import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingWebhookController } from './billing-webhook.controller';
import { BillingCronController } from './billing-cron.controller';
import { WompiService } from './wompi.service';

@Module({
  controllers: [BillingController, BillingWebhookController, BillingCronController],
  providers: [WompiService],
  exports: [WompiService],
})
export class BillingModule {}


