import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WompiService } from './wompi.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly wompi: WompiService) {}

  @Get('acceptance-token')
  async acceptanceToken() {
    const token = await this.wompi.getAcceptanceToken();
    return { acceptanceToken: token };
  }

  @Post('payment-source')
  async createPaymentSource(
    @Req() req: any,
    @Body()
    body: {
      customerEmail?: string;
      token: string;
      acceptanceToken: string;
      nickname?: string;
    },
  ) {
    const organizationId = req.user.org;
    const customerEmail = body.customerEmail || req.user.email;
    const pm = await this.wompi.createPaymentSource({ organizationId, customerEmail, token: body.token, acceptanceToken: body.acceptanceToken, nickname: body.nickname });
    return pm;
  }

  @Post('start-trial')
  async startTrial(
    @Req() req: any,
    @Body()
    body: { planCode?: string; defaultPaymentMethodId?: string },
  ) {
    const organizationId = req.user.org;
    const sub = await this.wompi.startTrialSubscription(organizationId, body.planCode, body.defaultPaymentMethodId);
    return sub;
  }

  @Post('charge-now')
  async chargeNow(@Req() req: any, @Body() body: { amountCents?: number; currency?: string }) {
    const organizationId = req.user.org;
    const amountCents = body.amountCents ?? 500 * 100; // $5 USD por usuario: ejemplo, ajustar a COP si se requiere
    return this.wompi.chargeMonthlySubscription(organizationId, amountCents, body.currency || 'COP');
  }

  @Post('run-due-charges')
  async runDue() {
    return this.wompi.runDueCharges();
  }

  @Get('me')
  async me(@Req() req: any) {
    const organizationId = req.user.org;
    const [subscription, paymentMethods] = await Promise.all([
      this.wompi.getOrganizationSubscription(organizationId),
      this.wompi.listPaymentMethods(organizationId),
    ]);
    const now = new Date();
    const trialActive = subscription?.status === 'TRIALING' && subscription.trialEndsAt && new Date(subscription.trialEndsAt) > now;
    const hasMethod = (paymentMethods || []).length > 0;
    const shouldRedirectToBilling = (!trialActive) && !hasMethod; // fuera de trial y sin método
    return { subscription, paymentMethods, trialActive, hasMethod, shouldRedirectToBilling };
  }
}


