import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from './auth.service';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/company/entities/company.entity';
import { ConfigService } from '@nestjs/config';

export interface AuthenticatedRequest extends Request {
  company: Company;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private companyService: CompanyService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromCookies(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Find company based on token payload
      const company = await this.companyService.findById(payload.sub);

      if (!company) {
        throw new UnauthorizedException();
      }

      // If exists, add the company to the request
      request['company'] = company;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies.token;
  }
}
