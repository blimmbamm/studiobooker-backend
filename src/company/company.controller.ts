import { Controller, Get, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseCompany } from 'src/auth/auth.decorator';
import { Company } from './entities/company.entity';

@UseGuards(AuthGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  getCompany(@UseCompany() { id }: Company) {
    return this.companyService.findByIdWithRelationsOrThrowNotFoundException(
      id,
      {
        companyInfo: true,
        workingTimeSettings: true,
      },
    );
  }
}
