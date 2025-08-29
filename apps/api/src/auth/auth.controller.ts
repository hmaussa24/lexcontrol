import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  async signup(
    @Body()
    body: { organizationName: string; name: string; email: string; password: string },
  ) {
    return this.auth.signup(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return { userId: req.user.sub, organizationId: req.user.org };
  }
}


