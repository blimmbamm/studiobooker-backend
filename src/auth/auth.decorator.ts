import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from './auth.guard';
import { Company } from 'src/company/entities/company.entity';

export const UseCompany = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Company => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.company;
  },
);
