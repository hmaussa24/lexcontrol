import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PublicSuggestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyCaptcha(token: string, ip?: string) {
    const secret = process.env.HCAPTCHA_SECRET;
    if (!secret) throw new BadRequestException('HCAPTCHA_SECRET no configurado');
    const params = new URLSearchParams({ secret, response: token });
    if (ip) params.set('remoteip', ip);
    const { data } = await axios.post('https://hcaptcha.com/siteverify', params);
    if (!data?.success) {
      const codes = (data && (data['error-codes'] || data.error_codes)) || [];
      const msg = Array.isArray(codes) && codes.length ? `Captcha inválido: ${codes.join(',')}` : 'Captcha inválido';
      throw new BadRequestException(msg);
    }
  }

  async create(input: { name: string; email: string; content: string; captchaToken: string; ip?: string }) {
    if (!input.name || !input.email || !input.content) throw new BadRequestException('Campos requeridos');
    await this.verifyCaptcha(input.captchaToken, input.ip);
    const s = await this.prisma.suggestion.create({ data: { name: input.name, email: input.email, content: input.content } });
    return s;
  }

  list(params?: { q?: string; sort?: 'new' | 'top'; page?: number; pageSize?: number }) {
    const where: any = params?.q ? { OR: [ { content: { contains: params.q, mode: 'insensitive' } }, { name: { contains: params.q, mode: 'insensitive' } } ] } : undefined;
    const page = params?.page && params.page > 0 ? params.page : 1;
    const pageSize = params?.pageSize && params.pageSize > 0 ? params.pageSize : 20;
    const orderBy = params?.sort === 'top' ? { votesCount: 'desc' as const } : { createdAt: 'desc' as const };
    return this.prisma.$transaction([
      this.prisma.suggestion.count({ where }),
      this.prisma.suggestion.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    ]).then(([total, data]) => ({ total, page, pageSize, data }));
  }

  async vote(id: string, input: { email?: string; ip?: string }) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.suggestionVote.create({ data: { suggestionId: id, email: input.email, ip: input.ip } });
        await tx.suggestion.update({ where: { id }, data: { votesCount: { increment: 1 } } });
      });
    } catch (e: any) {
      throw new BadRequestException('Ya votaste esta sugerencia');
    }
    return { ok: true };
  }
}


