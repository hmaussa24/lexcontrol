import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const path: string = req?.path || req?.url || '';
    const method: string = req?.method || '';
    // Permitir públicos o preflight
    if (method === 'OPTIONS') return true;
    if (path.startsWith('/auth') || path.startsWith('/billing') || path.startsWith('/public')) return true;
    const orgId: string | undefined = req?.user?.org;
    // Si no hay usuario (rutas públicas), permitir
    if (!orgId) return true;
    const now = new Date();
    const sub = await this.prisma.subscription.findUnique({ where: { organizationId: orgId } });
    if (!sub) return true; // permitir hasta crear trial/metodo
    if (sub.status === 'TRIALING' && sub.trialEndsAt && sub.trialEndsAt > now) return true;
    if (sub.status === 'ACTIVE' && sub.currentPeriodEnd && sub.currentPeriodEnd > now) return true;
    return false;
  }
}


