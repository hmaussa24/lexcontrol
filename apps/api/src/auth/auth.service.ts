import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { WompiService } from '../billing/wompi.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly wompi: WompiService) {}

  async signup(input: { organizationName: string; name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const org = await this.prisma.organization.create({ data: { name: input.organizationName } });
    const user = await this.prisma.user.create({
      data: {
        organizationId: org.id,
        email: input.email.toLowerCase(),
        name: input.name,
        hashedPassword,
        role: 'admin',
      },
    });
    // Iniciar trial automáticamente
    await this.wompi.startTrialSubscription(org.id, 'PRO');
    const token = await this.sign(user.id, org.id);
    return { token, user: { id: user.id, name: user.name, email: user.email }, organization: { id: org.id, name: org.name } };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.prisma.user.findFirst({ where: { email: input.email.toLowerCase(), active: true } });
    if (!user || !user.hashedPassword) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(input.password, user.hashedPassword);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');
    const token = await this.sign(user.id, user.organizationId);
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  private async sign(userId: string, organizationId: string) {
    return this.jwt.signAsync({ sub: userId, org: organizationId });
  }
}


