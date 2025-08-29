import { BadRequestException, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { WompiService } from './wompi.service';

@Controller('billing/cron')
export class BillingCronController {
  constructor(private readonly wompi: WompiService) {}

  @Post('run-due-charges')
  @HttpCode(200)
  async run(@Query('key') key?: string) {
    if (!process.env.CRON_SECRET) throw new BadRequestException('CRON_SECRET no configurado');
    if (key !== process.env.CRON_SECRET) throw new BadRequestException('Clave inválida');
    return this.wompi.runDueCharges();
  }
}


