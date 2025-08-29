import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../prisma/prisma.service';

type CreatePaymentSourceInput = {
  customerEmail: string;
  token: string; // token de tarjeta generado en el frontend con Wompi.js
  acceptanceToken: string;
  nickname?: string;
  organizationId: string;
};

@Injectable()
export class WompiService {
  private readonly http: AxiosInstance;
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(private readonly prisma: PrismaService) {
    const baseUrl = process.env.WOMPI_BASE_URL ?? 'https://sandbox.wompi.co/v1';
    this.publicKey = process.env.WOMPI_PUBLIC_KEY ?? '';
    this.privateKey = process.env.WOMPI_PRIVATE_KEY ?? '';
    this.http = axios.create({ baseURL: baseUrl, timeout: 10000 });
  }

  async getAcceptanceToken(): Promise<string> {
    if (!this.publicKey) {
      throw new BadRequestException('Configura WOMPI_PUBLIC_KEY en el backend');
    }
    try {
      const { data } = await this.http.get(`/merchants/${this.publicKey}`);
      const token = data?.data?.presigned_acceptance?.acceptance_token;
      if (!token) throw new BadRequestException('No se pudo obtener acceptance_token de Wompi');
      return token;
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Error consultando Wompi';
      throw new BadRequestException(msg);
    }
  }

  async createPaymentSource(input: CreatePaymentSourceInput) {
    const { customerEmail, token, acceptanceToken, nickname, organizationId } = input;
    if (!this.privateKey) {
      throw new BadRequestException('Configura WOMPI_PRIVATE_KEY en el backend');
    }
    if (!token) throw new BadRequestException('Falta token de tarjeta');
    if (!acceptanceToken) throw new BadRequestException('Falta acceptance_token');
    let data: any;
    try {
      const resp = await this.http.post(
        '/payment_sources',
        {
          type: 'CARD',
          token,
          customer_email: customerEmail,
          acceptance_token: acceptanceToken,
          nickname,
        },
        { headers: { Authorization: `Bearer ${this.privateKey}` } },
      );
      data = resp.data;
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Error creando payment source en Wompi';
      throw new BadRequestException(msg);
    }

    const sourceId: string = data?.data?.id;
    const cardToken: string | undefined = data?.data?.token || input.token;
    // Persistir método de pago
    const paymentMethod = await this.prisma.paymentMethod.create({
      data: {
        organizationId,
        provider: 'wompi',
        type: 'CARD',
        wompiPaymentSourceId: sourceId,
        wompiCardToken: cardToken as any,
        status: 'ACTIVE',
      } as any,
    });
    return paymentMethod;
  }

  async chargeMonthlySubscription(organizationId: string, amountCents?: number, currency?: string) {
    const org = await this.prisma.organization.findUnique({ where: { id: organizationId }, include: { subscription: true, defaultPaymentMethod: true } });
    if (!org || !org.subscription) throw new BadRequestException('Organización o suscripción no encontrada');
    if (!org.defaultPaymentMethod?.wompiPaymentSourceId) throw new BadRequestException('No hay método de pago por defecto');
    if (!this.privateKey) throw new BadRequestException('Configura WOMPI_PRIVATE_KEY');
    const cents = amountCents ?? parseInt(process.env.BILLING_AMOUNT_CENTS || '20000');
    const curr = currency || process.env.BILLING_CURRENCY || 'COP';
    try {
      const { data } = await this.http.post('/transactions', {
        amount_in_cents: cents,
        currency: curr,
        customer_email: (await this.prisma.user.findFirst({ where: { organizationId }, orderBy: { createdAt: 'asc' } }))?.email,
        payment_method: { type: 'CARD', installments: 1 },
        payment_source_id: org.defaultPaymentMethod.wompiPaymentSourceId,
      }, { headers: { Authorization: `Bearer ${this.privateKey}` } });
      const status = data?.data?.status || 'PENDING';
      const now = new Date();
      const nextEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      await this.prisma.subscription.update({ where: { organizationId }, data: {
        lastChargeAt: now as any,
        lastChargeStatus: status as any,
        lastChargeError: null as any,
        status: (status === 'APPROVED' ? 'ACTIVE' : status === 'DECLINED' ? 'PAST_DUE' : org.subscription.status) as any,
        currentPeriodStart: status === 'APPROVED' ? now : org.subscription.currentPeriodStart,
        currentPeriodEnd: status === 'APPROVED' ? nextEnd : org.subscription.currentPeriodEnd,
      } as any });
      return { status };
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Error al cobrar suscripción';
      await this.prisma.subscription.update({ where: { organizationId }, data: {
        lastChargeAt: new Date() as any,
        lastChargeStatus: 'ERROR' as any,
        lastChargeError: msg as any,
        status: 'PAST_DUE' as any,
      } as any });
      throw new BadRequestException(msg);
    }
  }

  async runDueCharges() {
    const now = new Date();
    const subs = await this.prisma.subscription.findMany({
      where: {
        OR: [
          { status: 'TRIALING', trialEndsAt: { lte: now } },
          { status: { in: ['ACTIVE', 'PAST_DUE'] }, currentPeriodEnd: { lte: now } },
        ],
      },
      include: { organization: { include: { defaultPaymentMethod: true } } },
    });
    const results: any[] = [];
    for (const s of subs) {
      try {
        const r = await this.chargeMonthlySubscription(s.organizationId);
        results.push({ organizationId: s.organizationId, ok: true, status: r.status });
      } catch (e: any) {
        results.push({ organizationId: s.organizationId, ok: false, error: e?.message });
      }
    }
    return { count: subs.length, results };
  }

  async startTrialSubscription(organizationId: string, planCode = 'PRO', defaultPaymentMethodId?: string) {
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const subscription = await this.prisma.subscription.upsert({
      where: { organizationId },
      update: {
        planCode,
        status: 'TRIALING',
        trialEndsAt,
        currentPeriodStart: now,
        currentPeriodEnd: trialEndsAt,
        defaultPaymentMethodId,
      },
      create: {
        organizationId,
        planCode,
        status: 'TRIALING',
        trialEndsAt,
        currentPeriodStart: now,
        currentPeriodEnd: trialEndsAt,
        defaultPaymentMethodId,
      },
    });

    // Guardar en Organization el defaultPaymentMethod si viene
    if (defaultPaymentMethodId) {
      await this.prisma.organization.update({
        where: { id: organizationId },
        data: { defaultPaymentMethodId },
      });
    }
    return subscription;
  }

  async getOrganizationSubscription(organizationId: string) {
    return this.prisma.subscription.findUnique({ where: { organizationId } });
  }

  async listPaymentMethods(organizationId: string) {
    return this.prisma.paymentMethod.findMany({ where: { organizationId, status: 'ACTIVE' } });
  }

  async handleWebhook(payload: any) {
    try {
      const event = payload?.event;
      const data = payload?.data;
      // Procesar algunos eventos clave
      if (event === 'transaction.updated' || event === 'transaction.created') {
        // Aquí podríamos marcar pagos como aprobados/declinados si usáramos cargos únicos.
        return;
      }
      if (event === 'subscription.charged') {
        const orgExtId = data?.subscription?.customer_email; // Si se identificara por email del owner
        // En este ejemplo no tenemos mapping directo; normalmente guardaríamos wompi subscription id.
        return;
      }
    } catch (e) {
      // swallow
    }
  }
}


