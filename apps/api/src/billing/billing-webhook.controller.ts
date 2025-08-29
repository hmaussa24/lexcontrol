import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { WompiService } from './wompi.service';

@Controller('billing')
export class BillingWebhookController {
  constructor(private readonly wompi: WompiService) {}

  @Post('webhook')
  @HttpCode(200)
  async webhook(@Body() payload: any) {
    await this.wompi.handleWebhook(payload);
    return { ok: true };
  }
}


