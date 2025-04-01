import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedRequest } from './auth.guard';
import { Company } from 'src/company/entities/company.entity';

export const UseCompany = createParamDecorator(
  (data: unknown, context: ExecutionContext): Company => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.jwtPayload.company 
  },
);